import React, { useEffect, useMemo, useState } from "react"
import { SERVER_URL } from "../utils/types"
import type { Food, ConsumedFood } from "../utils/types"

import FoodDetailModal from "./FoodDetailModal"
import { useModal } from "../contexts/ModalContext"

interface FoodListModalProps {
    onFoodAdd: (entry: ConsumedFood) => void
}

const FoodListModal: React.FC<FoodListModalProps> = ({ onFoodAdd }) => {
    const [foods, setFoods] = useState<Food[]>([])
    const [search, setSearch] = useState("")
    const { openModal, closeModal } = useModal()

    useEffect(() => {
        fetch(`${SERVER_URL}/food/`)
            .then((res) => res.json())
            .then((data) => setFoods(data))
    }, [])

    const handleSelectFood = (food: Food) => {
        openModal({
            component: (
                <FoodDetailModal
                    food={food}
                    onConfirm={(kcal, carbs, protein, fat) => {
                        // construyo aquí la entrada con el tipo correcto
                        const entry: ConsumedFood = {
                            food,
                            kcal,
                            carbs,
                            protein,
                            fat,
                        }
                        onFoodAdd(entry)
                        closeModal()
                    }}
                />
            ),
            title: food.name,
        })
    }

    const filteredFoods = useMemo(() => {
        return foods
            .filter((food) =>
                food.name.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 10)
    }, [foods, search])

    // const handleAddFood = (food: Food) => {
    //     const stored = JSON.parse(localStorage.getItem("addedFoods") || "[]")
    //     const updated = [...stored, food]
    //     localStorage.setItem("addedFoods", JSON.stringify(updated))
    //     alert(`Alimento agregado: ${food.name}`)
    // }

    return (
        <div className="flex flex-col">
            <input
                type="text"
                placeholder="Buscar alimento..."
                className="w-full mb-4 px-3 py-2 border rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="overflow-y-auto max-h-[300px]">
                {filteredFoods.map((food) => (
                    <div
                        key={food.code}
                        className="flex justify-between p-2 hover:bg-gray-100 cursor-pointer border-b"
                        onClick={() => handleSelectFood(food)}
                    >
                        <span>{food.name}</span>
                        <span>{food.energy_kcal} kcal</span>
                    </div>
                ))}
                {filteredFoods.length === 0 && (
                    <p className="text-center text-gray-500">
                        No se encontraron alimentos
                    </p>
                )}
            </div>
        </div>
    )
}

export default FoodListModal
