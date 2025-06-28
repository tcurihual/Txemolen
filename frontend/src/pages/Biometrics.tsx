import React, { useEffect, useState } from "react"
import { motion } from "motion/react"

import { IoScale } from "react-icons/io5"
import { BiSolidCake } from "react-icons/bi"
import { TbRulerMeasure2 } from "react-icons/tb"
import { FaTint } from "react-icons/fa"
import { IoMdMale } from "react-icons/io"
import { IoMdFemale } from "react-icons/io"

import { useAuth } from "../contexts/AuthContext"
import { BiometricsInput } from "../components/inputForm"
import type { GenderType } from "../utils/types"
import { useBiometrics } from "../contexts/BioContext"

const Biometrics: React.FC = () => {
    const { User } = useAuth()
    const { TDEE } = useBiometrics()
    const [gender, setGender] = useState<GenderType>(User?.gender || "Male")
    const [kcal, setKcal] = useState<number | undefined>(undefined)
    const [activityLevel, setActivityLevel] = useState<number>(1.2)

    useEffect(() => {
        const fetchTDEE = async () => {
            const value = await TDEE(activityLevel)
            setKcal(value)
        }
        fetchTDEE()
    }, [User, activityLevel])

    return (
        <div className="flex w-full h-full justify-between">
            <div className="flex flex-col self-center justify-evenly h-[90%] w-[30%]">
                <div className="w-[100%] h-[13%]">
                    <p className="text-xl pb-[2.5%]">Genero</p>
                    <div className="relative flex p-1 items-center rounded-3xl w-full h-[65%] border-[2.5px] border-gray-300 overflow-hidden bg-gray-200">
                        <motion.div
                            className={`absolute top-0 h-full w-1/2 rounded-2xl z-0 ${
                                gender === "Male"
                                    ? "bg-blue-400"
                                    : "bg-pink-300"
                            }`}
                            initial={false}
                            animate={{
                                left: gender === "Male" ? "0%" : "50%",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                        />

                        <motion.button
                            className={`relative flex flex-col justify-evenly items-center w-1/2 h-full text-lg z-10 ${
                                gender === "Male"
                                    ? "text-white"
                                    : "text-gray-700"
                            }`}
                            onClick={() => setGender("Male")}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                        >
                            <IoMdMale className="w-7 h-7" />
                            <span>Masculino</span>
                        </motion.button>

                        <motion.button
                            className={`relative flex flex-col justify-evenly items-center w-1/2 h-full text-lg z-10 ${
                                gender === "Female"
                                    ? "text-white"
                                    : "text-gray-700"
                            }`}
                            onClick={() => setGender("Female")}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                        >
                            <IoMdFemale className="w-7 h-7" />
                            <span>Femenino</span>
                        </motion.button>
                    </div>
                </div>

                <BiometricsInput
                    Icon={BiSolidCake}
                    name="Edad"
                    color="pink"
                    rightText="Años"
                />
                <BiometricsInput
                    Icon={IoScale}
                    name="Peso (Kg)"
                    color="#6FD4E3"
                    rightText="Kg"
                />
                <BiometricsInput
                    Icon={TbRulerMeasure2}
                    name="Estatura (cm)"
                    color="#A3E06D"
                    rightText="cm"
                />
                <BiometricsInput
                    Icon={FaTint}
                    name="Porcentaje de grasa"
                    color="#FFEE6E"
                    rightText="%"
                />
                <div className="w-[100%] h-[13%]">
                    <p className="text-xl pb-[2.5%]">Nivel de actividad</p>
                    <select
                        className="w-full h-[65%] border-2 border-gray-300 rounded-lg p-2"
                        value={activityLevel}
                        onChange={(e) =>
                            setActivityLevel(Number(e.target.value))
                        }
                    >
                        <option value={1.2}>
                            Sedentario (poco o ningún ejercicio)
                        </option>
                        <option value={1.375}>
                            Ligero (ejercicio 1-3 días/semana)
                        </option>
                        <option value={1.55}>
                            Moderado (ejercicio 3-5 días/semana)
                        </option>
                        <option value={1.725}>
                            Activo (ejercicio 6-7 días/semana)
                        </option>
                        <option value={1.9}>
                            Muy activo (ejercicio intenso + trabajo físico)
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex w-[65%] h-[90%] justify-center self-center rounded-xl border-8 border-[#F6F6F6]">
                {kcal ? Math.round(kcal) + " kcal/día" : "Cargando..."}
            </div>
        </div>
    )
}

export default Biometrics
