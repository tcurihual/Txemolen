import React from "react"
import {
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { motion } from "motion/react"
import { useBiometrics } from "../contexts/BioContext"
import FlameFill from "../components/FlameFill"

const Dashboard: React.FC = () => {
    const { dailyGoal } = useBiometrics()
    const total = dailyGoal?.kcal ?? 1
    const now = 2320
    const percentage = (now * 100) / total
    const consumed = { carbs: 150, protein: 80, fats: 60 }

    const date = new Date().toLocaleString("es-Es", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })

    interface MacroCircleProps {
        label: string
        value: number
        max: number
        color: string
    }

    const MacroCircle: React.FC<MacroCircleProps> = ({
        label,
        value,
        max,
        color,
    }) => {
        const pct = Math.min((value * 100) / max, 100)
        const intMax = Math.floor(max)
        return (
            <div className="w-50">
                <CircularProgressbarWithChildren
                    strokeWidth={3}
                    value={pct}
                    circleRatio={0.7}
                    styles={buildStyles({
                        rotation: 1 - 0.7 / 2,
                        pathColor: color,
                        trailColor: "#F6F6F6",
                    })}
                >
                    <div className="text-center text-md">
                        <strong className="text-lg">
                            {value} / {intMax}
                        </strong>
                        <div className="text-md text-gray-500">Gramos</div>
                    </div>
                </CircularProgressbarWithChildren>
                <p className="text-xl align-center text-center">{label}</p>
            </div>
        )
    }

    return (
        <div className="flex w-full h-full justify-between">
            <div className="flex w-[70%] justify-center items-center gap-10">
                <div className="flex gap-10 ">
                    <MacroCircle
                        label="Carbs"
                        value={consumed.carbs}
                        max={dailyGoal?.carbos ?? 1}
                        color="#FFA971"
                    />
                    <MacroCircle
                        label="Proteína"
                        value={consumed.protein}
                        max={dailyGoal?.protein ?? 1}
                        color="#FC9997"
                    />
                    <MacroCircle
                        label="Grasas"
                        value={consumed.fats}
                        max={dailyGoal?.fat ?? 1}
                        color="#FFEE6E"
                    />
                    <div className="h-[100$] rounded-2xl w-[1%] bg-[#F6F6F6]"></div>
                    <div className="flex flex-col w-[18%] h-[100$] justify-evenly items-center">
                        <p className="text-lg font-bold">Objetivo Diario</p>
                        <p className="text-lg">
                            {Math.floor(dailyGoal?.kcal ?? 1)} Calorias
                        </p>
                        <FlameFill percentage={40} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[25%] h-full border-l-5 border-[#F6F6F6]">
                <div className="flex flex-col h-full border-b-5 border-[#F6F6F6] justify-evenly items-center">
                    <p className="text-[20px]">
                        {date.split(",")[1].toString().trim()}
                    </p>
                    <div className="w-[200px] h-[158px]">
                        <CircularProgressbarWithChildren
                            strokeWidth={3}
                            value={percentage}
                            circleRatio={0.7}
                            styles={buildStyles({
                                rotation: 0.65,
                                pathColor: "#B88CFF",
                                trailColor: "#F6F6F6",
                            })}
                        >
                            <div className="flex flex-col h-[55%] gap-[10px]">
                                <div className="flex flex-col items-center leading-7">
                                    <p className="font-semibold text-[24px]">
                                        {now}
                                    </p>
                                    <p className="text-[18px]">kcal</p>
                                </div>
                                <p className="text-lg text-gray-500">
                                    {date.split(",")[0].toString().trim()}
                                </p>
                            </div>
                        </CircularProgressbarWithChildren>
                    </div>
                    <motion.button
                        className="w-[65%] h-[11%] rounded-[15px] bg-[#F6F6F6] text-[18px] text-center cursor-pointer hover:bg-[#B88CFF] transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Agregar Alimento
                    </motion.button>
                </div>
                <div className="flex flex-col h-full items-center">
                    <div className="w-[65%] h-[15%] text-center">Desayuno</div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
