import React, { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

type BiometricsContextType = {
    BMR: () => Promise<number | undefined>
    TDEE: (activityLevel: number) => Promise<number | undefined>
}

const BiometricsContext = createContext<BiometricsContextType | undefined>(
    undefined
)

export const BiometricsProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { User } = useAuth()

    const BMR = async () => {
        if (!User) return undefined

        if (User.fat_percentage) {
            const leanMass = User.weight * (1 - User.fat_percentage / 100)
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
        <BiometricsContext.Provider value={{ BMR, TDEE }}>
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
