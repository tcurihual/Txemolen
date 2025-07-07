import type { BiometricsFormData } from "./types"

export const calculateBMR = (data: BiometricsFormData) => {
    if (data.fat_percentage != null) {
        const leanMass = data.weight * (1 - data.fat_percentage / 100)
        return 370 + 21.6 * leanMass
    } else {
        return data.gender === "Male"
            ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
            : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161
    }
}

export const calculateTDEE = (data: BiometricsFormData) => {
    const bmr = calculateBMR(data)
    const activityLevelFactors: Record<string, number> = {
        Sedentary: 1.2,
        Light: 1.375,
        Moderate: 1.55,
        High: 1.725,
        VeryHigh: 1.9,
    }
    const factor = activityLevelFactors[data.activity_level] ?? 1.2
    return bmr * factor
}
