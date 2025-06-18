import { z } from "zod/v4"
import type { loginFormSchema, registerFormSchema } from "./validations"

export const SERVER_URL = import.meta.env.VITE_SERVER_URL as string

export type MealType = "Desayuno" | "Almuerzo" | "Cena" | "Snack"

export interface Food {
    code: string
    name: string
    serving_size: number
    energy_kcal: number
    proteins: number
    fat: number
    carbohydrates: number
}

export interface User {
    id: number
    name: string
    email: string
    password: string
    gender: string
    age: number
    weight: number
    height: number
    fat_percentage?: number
    daily_goal_id: number
}

export interface UserDTO extends Omit<User, "id" | "daily_goal_id"> {}

export interface UserResponse extends Omit<User, "password"> {}

export interface Meal {
    id: number
    meal_type: MealType
    day_id: number
}

export interface MealFood {
    meal_id: number
    food_code: string
    servings: number
}

export interface Day {
    id: number
    date: string
    completed: boolean
    user_id: number
    daily_goal_id: number
}

export interface DailyGoal {
    id: number
    kcal: number
    protein: number
    carbos: number
    fat: number
}

export type LoginFormData = z.infer<typeof loginFormSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>

export interface CreateFoodPayload extends Omit<Food, "code"> {}
export interface CreateUserPayload extends Omit<User, "id" | "daily_goal_id"> {
    password_confirmation: string
}
export interface CreateMealPayload extends Omit<Meal, "id"> {}
export interface CreateDailyGoalPayload extends Omit<DailyGoal, "id"> {}

export interface MealWithFoods extends Meal {
    foods: Array<Food & { servings: number }>
}

export interface DayWithMeals extends Day {
    meals: MealWithFoods[]
    daily_goal: DailyGoal
}
