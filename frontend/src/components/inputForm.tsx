import React from "react"
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form"

interface FormInputProps {
    label: string
    name: string
    type?: string
    placeholder?: string
    register: UseFormRegisterReturn
    error?: FieldError
}

const FormInput: React.FC<FormInputProps> = ({
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
                type={name}
                {...register}
            />
        </div>
    )
}

export default FormInput
