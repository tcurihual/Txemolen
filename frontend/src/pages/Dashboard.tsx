import React, { useEffect, useState } from "react"
import {
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { motion } from "motion/react"
import { useBiometrics } from "../contexts/BioContext"
import FlameFill from "../components/FlameFill"
import { useModal } from "../contexts/ModalContext"
import FoodListModal from "../components/FoodListModal"
import type { ConsumedFood } from "../utils/types"

const Dashboard: React.FC = () => {
    const { dailyGoal } = useBiometrics()
    const { openModal } = useModal()
    const [entries, setEntries] = useState<ConsumedFood[]>([])
    const [consumedTotals, setConsumedTotals] = useState({
        kcal: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    })

    const handleAddFood = (entry: ConsumedFood) => {
        setConsumedTotals((prev) => ({
            kcal: +(prev.kcal + entry.kcal).toFixed(1),
            carbs: +(prev.carbs + entry.carbs).toFixed(1),
            protein: +(prev.protein + entry.protein).toFixed(1),
            fat: +(prev.fat + entry.fat).toFixed(1),
        }))

        const stored: ConsumedFood[] = JSON.parse(
            localStorage.getItem("addedFoods") || "[]"
        )
        stored.push(entry)
        localStorage.setItem("addedFoods", JSON.stringify(stored))

        setEntries((prev) => {
            const next = [...prev, entry]
            localStorage.setItem("addedFoods", JSON.stringify(next))
            return next
        })
    }

    const handleOpenFoodModal = () => {
        openModal({
            component: <FoodListModal onFoodAdd={handleAddFood} />,
            title: "Seleccionar Alimento",
            size: "lg",
        })
    }

    const handleRemove = (index: number) => {
        setEntries((prev) => {
            const next = prev.filter((_, i) => i !== index)
            localStorage.setItem("addedFoods", JSON.stringify(next))
            const total = next.reduce(
                (acc, item) => ({
                    kcal: acc.kcal + item.kcal,
                    carbs: acc.carbs + item.carbs,
                    protein: acc.protein + item.protein,
                    fat: acc.fat + item.fat,
                }),
                { kcal: 0, carbs: 0, protein: 0, fat: 0 }
            )
            setConsumedTotals({
                kcal: +total.kcal.toFixed(1),
                carbs: +total.carbs.toFixed(1),
                protein: +total.protein.toFixed(1),
                fat: +total.fat.toFixed(1),
            })
            return next
        })
    }

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("addedFoods") || "[]")

        const total = stored.reduce(
            (acc: any, item: any) => {
                if ("kcal" in item) {
                    return {
                        kcal: acc.kcal + item.kcal,
                        carbs: acc.carbs + item.carbs,
                        protein: acc.protein + item.protein,
                        fat: acc.fat + item.fat,
                    }
                } else {
                    const multiplier = item.serving_size / 100
                    return {
                        kcal: acc.kcal + (item.energy_kcal ?? 0) * multiplier,
                        carbs:
                            acc.carbs + (item.carbohydrates ?? 0) * multiplier,
                        protein:
                            acc.protein + (item.proteins ?? 0) * multiplier,
                        fat: acc.fat + (item.fat ?? 0) * multiplier,
                    }
                }
            },
            { kcal: 0, carbs: 0, protein: 0, fat: 0 }
        )

        setConsumedTotals({
            kcal: +total.kcal.toFixed(1),
            carbs: +total.carbs.toFixed(1),
            protein: +total.protein.toFixed(1),
            fat: +total.fat.toFixed(1),
        })
    }, [])

    useEffect(() => {
        const stored: ConsumedFood[] = JSON.parse(
            localStorage.getItem("addedFoods") || "[]"
        )
        setEntries(stored)

        const total = stored.reduce(
            (acc, item) => ({
                kcal: acc.kcal + item.kcal,
                carbs: acc.carbs + item.carbs,
                protein: acc.protein + item.protein,
                fat: acc.fat + item.fat,
            }),
            { kcal: 0, carbs: 0, protein: 0, fat: 0 }
        )
        setConsumedTotals({
            kcal: +total.kcal.toFixed(1),
            carbs: +total.carbs.toFixed(1),
            protein: +total.protein.toFixed(1),
            fat: +total.fat.toFixed(1),
        })
    }, [])

    const total = dailyGoal?.kcal ?? 1
    const now = consumedTotals.kcal
    const percentage = (now * 100) / total

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
                        value={Math.floor(consumedTotals.carbs)}
                        max={dailyGoal?.carbos ?? 1}
                        color="#FFA971"
                    />
                    <MacroCircle
                        label="Proteína"
                        value={Math.floor(consumedTotals.protein)}
                        max={dailyGoal?.protein ?? 1}
                        color="#FC9997"
                    />
                    <MacroCircle
                        label="Grasas"
                        value={Math.floor(consumedTotals.fat)}
                        max={dailyGoal?.fat ?? 1}
                        color="#FFEE6E"
                    />
                    <div className="h-[100$] rounded-2xl w-[1%] bg-[#F6F6F6]"></div>
                    <div className="flex flex-col w-[18%] h-[100$] justify-evenly items-center">
                        <p className="text-lg font-bold">Objetivo Diario</p>
                        <p className="text-lg">
                            {Math.floor(dailyGoal?.kcal ?? 1)} Calorias
                        </p>
                        <FlameFill percentage={percentage} />
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
                        onClick={handleOpenFoodModal}
                    >
                        Agregar Alimento
                    </motion.button>
                </div>
                <div className="flex flex-col h-full px-4 overflow-y-auto">
                    <p className="w-full text-center font-semibold mb-2">
                        Desayuno
                    </p>
                    {entries.length === 0 && (
                        <p className="text-gray-500 text-sm">Sin alimentos</p>
                    )}
                    {entries.map((entry, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div>
                                <p className="font-medium">{entry.food.name}</p>
                                <p className="text-xs text-gray-500">
                                    {entry.kcal.toFixed(0)} kcal ·{" "}
                                    {entry.carbs.toFixed(0)}g C ·{" "}
                                    {entry.protein.toFixed(0)}g P ·{" "}
                                    {entry.fat.toFixed(0)}g F
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemove(idx)}
                                className="p-1 hover:bg-gray-200 rounded"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
