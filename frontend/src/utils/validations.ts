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
