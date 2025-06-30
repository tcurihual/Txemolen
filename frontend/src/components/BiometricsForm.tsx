import { useFormContext } from "react-hook-form"
import { motion } from "motion/react"
import { useState } from "react"
import type { ActivityLevelType } from "../utils/types"

import { IoScale } from "react-icons/io5"
import { BiSolidCake } from "react-icons/bi"
import { TbRulerMeasure2 } from "react-icons/tb"
import { FaTint } from "react-icons/fa"
import { IoMdMale, IoMdFemale } from "react-icons/io"

import { BiometricsInput } from "./inputForm"

const activityLevelOptions: { value: ActivityLevelType; label: string }[] = [
    { value: "Sedentary", label: "Sedentario (poco o ningún ejercicio)" },
    { value: "Light", label: "Ligero (ejercicio 1-3 días/sem)" },
    { value: "Moderate", label: "Moderado (ejercicio 3-5 días/sem)" },
    { value: "Heavy", label: "Pesado (ejercicio 6-7 días/sem)" },
    { value: "Intense", label: "Intenso (entrenamientos muy duros diarios)" },
]

export const BiometricsForm = () => {
    const methods = useFormContext()
    const gender = methods.watch("gender")
    const fatPercentage = methods.watch("fat_percentage")

    const [useFatPercentage, setUseFatPercentage] = useState(
        fatPercentage !== null && fatPercentage !== undefined
    )

    const handleFatPercentageCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUseFatPercentage(e.target.checked)
        if (!e.target.checked) {
            methods.setValue("fat_percentage", null)
        }
        if (e.target.checked) methods.setValue("fat_percentage", 0)
    }

    return (
        <div className="flex flex-col self-center justify-evenly items-center h-[90%] w-[90%]">
            <div className="w-[100%] h-[13%]">
                <p className="text-xl pb-[2.5%]">Género</p>
                <div className="relative flex p-1 rounded-3xl w-full h-[65%] border-[2.5px] border-gray-300 overflow-hidden bg-gray-200">
                    <motion.div
                        className={`absolute top-0 h-full w-1/2 rounded-2xl z-0 ${
                            gender === "Male" ? "bg-blue-400" : "bg-pink-300"
                        }`}
                        animate={{ left: gender === "Male" ? "0%" : "50%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    />
                    <motion.button
                        type="button"
                        className="relative flex flex-col justify-evenly items-center w-1/2 h-full text-lg z-10"
                        onClick={() => methods.setValue("gender", "Male")}
                    >
                        <IoMdMale className="w-7 h-7" />
                        <span>Masculino</span>
                    </motion.button>
                    <motion.button
                        type="button"
                        className="relative flex flex-col justify-evenly items-center w-1/2 h-full text-lg z-10"
                        onClick={() => methods.setValue("gender", "Female")}
                    >
                        <IoMdFemale className="w-7 h-7" />
                        <span>Femenino</span>
                    </motion.button>
                </div>
            </div>

            <BiometricsInput
                Icon={BiSolidCake}
                labelName="Edad"
                color="pink"
                rightText="Años"
                error={methods.formState.errors.age}
                {...methods.register("age", { valueAsNumber: true })}
            />
            <BiometricsInput
                Icon={IoScale}
                labelName="Peso (Kg)"
                color="#6FD4E3"
                rightText="Kg"
                error={methods.formState.errors.weight}
                {...methods.register("weight", { valueAsNumber: true })}
            />
            <BiometricsInput
                Icon={TbRulerMeasure2}
                labelName="Estatura (cm)"
                color="#A3E06D"
                rightText="cm"
                error={methods.formState.errors.height}
                {...methods.register("height", { valueAsNumber: true })}
            />
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="useFatPercentage"
                    checked={useFatPercentage}
                    onChange={handleFatPercentageCheckboxChange}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="useFatPercentage" className="text-lg">
                    Usar Porcentaje de Grasa
                </label>
            </div>

            {useFatPercentage && (
                <BiometricsInput
                    Icon={FaTint}
                    labelName="Porcentaje de grasa"
                    color="#FFEE6E"
                    rightText="%"
                    error={methods.formState.errors.fat_percentage}
                    {...methods.register("fat_percentage", {
                        valueAsNumber: true,
                    })}
                />
            )}

            <div className="w-[100%] h-[13%]">
                <p className="text-xl pb-[2.5%]">Nivel de Actividad</p>
                <select
                    className="w-full h-[65%] p-2 border-[2.5px] border-gray-300 rounded-3xl bg-gray-200 text-lg"
                    {...methods.register("activity_level")}
                >
                    {activityLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {methods.formState.errors.activity_level && (
                    <p className="text-red-500 text-sm mt-1">
                        {
                            methods.formState.errors.activity_level
                                .message as string
                        }
                    </p>
                )}
            </div>
        </div>
    )
}
