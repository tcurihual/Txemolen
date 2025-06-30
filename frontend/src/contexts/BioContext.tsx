import React, {
    createContext,
    useContext,
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

    const biometricsManagement = async (data: BiometricUpdateDTO) => {
        return await withLoading(
            authenticatedFetch(`/biometrics/user/${User?.id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }).then(async (response) => {
                const responseData: BiometricsManagementResponse =
                    await response.json()
                updateVars(responseData.User)
                setDailyGoal(responseData.DailyGoal)
                return responseData
            })
        )
    }

    const BMR = async () => {
        if (!User || !User.weight || !User.height || !User.age) return undefined

        if (User.fat_percentage) {
            const leanMass = User?.weight * (1 - User.fat_percentage / 100)
            console.log("grasa")

            return 370 + 21.6 * leanMass
        } else {
            if (User.gender === "Male") {
                console.log("male")
                return 10 * User.weight + 6.25 * User.height - 5 * User.age + 5 // Mifflin-St Jeor
            } else {
                console.log("female")
                return (
                    10 * User.weight + 6.25 * User.height - 5 * User.age - 161
                )
            }
        }
    }

    const TDEE = async (activityLevel: number) => {
        const bmr = await BMR()
        console.log(bmr)
        if (!bmr) return undefined
        return bmr * activityLevel
    }

    return (
        <BiometricsContext.Provider
            value={{ dailyGoal, BMR, TDEE, biometricsManagement }}
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
