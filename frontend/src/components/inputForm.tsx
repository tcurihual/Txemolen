import React from "react"
import {
    type FieldError,
    type UseFormRegisterReturn,
    type Merge,
    type FieldErrorsImpl,
} from "react-hook-form"
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

interface BiometricsInputProps {
    Icon: IconType
    color?: string
    labelName: string
    rightContent?: boolean
    rightText?: string
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

export const BiometricsInput: React.FC<BiometricsInputProps> = ({
    Icon,
    color = "#000000",
    labelName,
    rightText,
    error,
    ...props
}) => (
    <div className="flex flex-col justify-between w-[100%] h-[13%]">
        <div className="flex text-center gap-5 items-center pb-[2.5px]">
            <p className="text-xl">{labelName}</p>
            {error &&
                "message" in error &&
                typeof error.message === "string" && (
                    <span className="text-red-500 text-sm mt-1">
                        {error.message}
                    </span>
                )}
        </div>

        <div className="flex items-center justify-center rounded-3xl w-full h-full border-[2.5px] border-gray-300 ">
            <div className="flex flex-1 h-full items-center justify-center border-r-[2.5px] border-gray-300 ">
                <Icon className="w-12 h-12" style={{ color }} />
            </div>
            <input
                className={` flex-2 w-full h-full pl-8 text-2xl focus:outline-none focus:ring-0 ${error ? "border-red-500" : ""}`}
                {...props}
            />
            {rightText && (
                <div className="flex flex-1 h-full items-center justify-center border-l-[2.5px] border-gray-300">
                    <p className="text-2xl">{rightText}</p>
                </div>
            )}
        </div>
    </div>
)

export default FormInput
