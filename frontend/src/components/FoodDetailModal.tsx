import React, { useState } from "react"
import { useModal } from "../contexts/ModalContext"
import type { Food } from "../utils/types"

type Props = {
    food: Food
    onConfirm: (
        kcal: number,
        carbs: number,
        protein: number,
        fat: number
    ) => void
}

const FoodDetailModal: React.FC<Props> = ({ food, onConfirm }) => {
    const { closeModal } = useModal()
    const [grams, setGrams] = useState(food.serving_size)

    const multiplier = grams / 100
    const kcal = +(food.energy_kcal * multiplier).toFixed(1)
    const carbs = +(food.carbohydrates * multiplier).toFixed(1)
    const protein = +(food.proteins * multiplier).toFixed(1)
    const fat = +(food.fat * multiplier).toFixed(1)

    const handleAdd = () => {
        onConfirm(kcal, carbs, protein, fat)
        closeModal()
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">{food.name}</p>

            <div className="flex flex-col gap-2 text-sm text-gray-700">
                <p>
                    <strong>Por 100g:</strong> {food.energy_kcal} kcal ·{" "}
                    {food.carbohydrates}g carbs · {food.proteins}g prot ·{" "}
                    {food.fat}g fat
                </p>
                <p>
                    <strong>Por porción ({food.serving_size}g):</strong>{" "}
                    {((food.energy_kcal * food.serving_size) / 100).toFixed(1)}{" "}
                    kcal
                </p>
            </div>

            <div>
                <label className="text-sm">Cantidad (g):</label>
                <input
                    type="number"
                    value={grams}
                    min={1}
                    className="w-full mt-1 p-2 border rounded"
                    onChange={(e) => setGrams(+e.target.value)}
                />
            </div>

            <div className="text-sm text-gray-600">
                <p>
                    <strong>Total:</strong> {kcal} kcal · {carbs}g carbs ·{" "}
                    {protein}g prot · {fat}g fat
                </p>
            </div>

            <button
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={handleAdd}
            >
                Agregar
            </button>
        </div>
    )
}

export default FoodDetailModal
