import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"
import { useAuth } from "./AuthContext"
import type {
    BiometricsManagementResponse,
    BiometricUpdateDTO,
    DailyGoal,
} from "../utils/types"
import { useLoading } from "./LoadingContext"

type BiometricsContextType = {
    dailyGoal: DailyGoal | undefined
    BMR: () => Promise<number | undefined>
    TDEE: (activityLevel: number) => Promise<number | undefined>
    biometricsManagement: (
        data: BiometricUpdateDTO
    ) => Promise<BiometricsManagementResponse>
    getDailyGoal: (
        data: BiometricUpdateDTO
    ) => Promise<BiometricsManagementResponse>
}

const BiometricsContext = createContext<BiometricsContextType | undefined>(
    undefined
)

export const BiometricsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { User, authenticatedFetch, updateVars } = useAuth()
    const { withLoading } = useLoading()
    const [dailyGoal, setDailyGoal] = useState<DailyGoal | undefined>(undefined)

    const getDailyGoal = async (): Promise<BiometricsManagementResponse> => {
        return withLoading(
            authenticatedFetch(`/biometrics/user/${User?.id}`, {
                method: "GET",
            }).then(async (response) => {
                const responseData: BiometricsManagementResponse =
                    await response.json()
                setDailyGoal(responseData.daily_goal)
                return responseData
            })
        )
    }

    const biometricsManagement = async (data: BiometricUpdateDTO) => {
        return await withLoading(
            authenticatedFetch(`/biometrics/user/${User?.id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }).then(async (response) => {
                const responseData: BiometricsManagementResponse =
                    await response.json()
                updateVars(responseData.user)
                setDailyGoal(responseData.daily_goal)
                return responseData
            })
        )
    }

    const BMR = async () => {
        if (!User || !User.weight || !User.height || !User.age) return undefined

        if (User.fat_percentage) {
            const leanMass = User?.weight * (1 - User.fat_percentage / 100)

            return 370 + 21.6 * leanMass
        } else {
            if (User.gender === "Male") {
                return 10 * User.weight + 6.25 * User.height - 5 * User.age + 5 // Mifflin-St Jeor
            } else {
                return (
                    10 * User.weight + 6.25 * User.height - 5 * User.age - 161
                )
            }
        }
    }

    const TDEE = async () => {
        const bmr = await BMR()
        if (!bmr) return undefined
        const activityLevelFactors: Record<string, number> = {
            Sedentary: 1.2,
            Light: 1.375,
            Medium: 1.55,
            High: 1.725,
            VeryHigh: 1.9,
        }
        const factor =
            activityLevelFactors[User?.activity_level ?? "Sedentary"] ?? 1.2
        return bmr * factor
    }

    useEffect(() => {
        const fetchDailyGoal = async () => {
            try {
                await getDailyGoal()
            } catch (error) {
                console.error("Error fetching daily goal:", error)
                setDailyGoal(undefined)
            }
        }

        if (User?.id) {
            fetchDailyGoal()
        }
    }, [User?.id, User?.daily_goal_id])

    return (
        <BiometricsContext.Provider
            value={{ dailyGoal, BMR, TDEE, biometricsManagement, getDailyGoal }}
        >
            {children}
        </BiometricsContext.Provider>
    )
}

export const useBiometrics = () => {
    const context = useContext(BiometricsContext)
    if (context === undefined) {
        throw new Error(
            "useBiometrics debe usarse dentro de un LoadingProvider"
        )
    }
    return context
}
