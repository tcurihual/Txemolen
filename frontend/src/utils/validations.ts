import { z } from "zod/v4"

export const registerFormSchema = z
    .object({
        name: z
            .string("Debes ingresar un nombre")
            .min(1, "Debes ingresar un nombre"),
        email: z.email("Debes ingresar un correo"),
        password: z
            .string("La contraseña es obligatoria")
            .min(8, "Debe tener al menos 8 caracteres")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Debe incluir al menos un carácter especial"
            )
            .regex(/\d/, "Debe incluir al menos un número"),
        verifyPassword: z.string("Confirme su contraseña"),
    })
    .refine((data) => data.password === data.verifyPassword, {
        message: "Las contraseñas no coinciden",
        path: ["verifyPassword"],
    })

export const loginFormSchema = z.object({
    email: z.email("Debes ingresar un correo"),
    password: z.string("Debes ingresar la contraseña"),
})

export const biometricsFormSchema = z.object({
    gender: z.enum(["Female", "Male"]),
    age: z
        .number("Debe ingresar un número")
        .min(10, "Edad mínima: 10 años")
        .max(100, "Edad máxima: 100 años"),
    weight: z
        .number("Debe ingresar un número")
        .min(30, "Peso Mínimo: 30 Kilogramos")
        .max(300, "Peso Máximo: 300 Kilogramos"),
    height: z
        .number("Debe ingresar un número")
        .min(80, "Altura Mínima: 100 centimetros")
        .max(210, "Altura Máxima: 210 centimetros"),
    fat_percentage: z
        .number("Debe ingresar un porcentaje")
        .min(0, "Mínimo 0%")
        .max(80, "Máximo 80%"),
})
