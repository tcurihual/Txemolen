import React from "react"
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form"
import type { IconType } from "react-icons/lib"

interface FormInputProps {
    label: string
    name: string
    type?: string
    placeholder?: string
    register: UseFormRegisterReturn
    error?: FieldError
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    placeholder,
    register,
    error,
}) => {
    const borderErr = error?.message ? "border-red-600" : "border-gray-300"
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor={name}>
                {label}
            </label>
            {error && (
                <span className="text-[14px] text-red-600">
                    {error.message}
                </span>
            )}
            <input
                id={name}
                className={`w-full px-3 py-2 border ${borderErr} rounded focus:outline-none focus:ring focus:ring-blue-200`}
                placeholder={placeholder}
                type={name === "password" ? name : "text"}
                {...register}
            />
        </div>
    )
}

interface BiometricsInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon: IconType
    color?: string
    rightContent?: boolean
    rightText?: string
}

export const BiometricsInput: React.FC<BiometricsInputProps> = ({
    Icon,
    color = "#000000",
    rightText,
}) => (
    <div className="flex items-center justify-center rounded-3xl w-[35%] h-[10%] border-[2.5px] border-gray-300 ">
        <div className="flex flex-1 h-full items-center justify-center border-r-[2.5px] border-gray-300 ">
            <Icon className="w-12 h-12" style={{ color }} />
        </div>
        <input className="flex-2 w-full h-full focus:outline-none focus:ring-0" />
        {rightText && (
            <div className="flex flex-1 h-full items-center justify-center border-l-[2.5px] border-gray-300">
                <p className="text-2xl">{rightText}</p>
            </div>
        )}
    </div>
)

export default FormInput
