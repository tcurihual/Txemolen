import { useCallback, useEffect, useMemo } from "react"
import { type BlockerFunction, useBlocker } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuth } from "../contexts/AuthContext"
import { useBiometrics } from "../contexts/BioContext"

import { BiometricsForm } from "../components/BiometricsForm"

import { biometricsFormSchema } from "../utils/validations"
import type { BiometricsFormData } from "../utils/types"
import NumberFlow from "@number-flow/react"
import { calculateTDEE } from "../utils/calories"

const Biometrics: React.FC = () => {
    const { User } = useAuth()
    const { dailyGoal, biometricsManagement } = useBiometrics()

    const methods = useForm<BiometricsFormData>({
        resolver: zodResolver(biometricsFormSchema),
        defaultValues: {
            gender: User?.gender || "Male",
            age: User?.age || 18,
            weight: User?.weight || 60,
            height: User?.height || 170,
            fat_percentage: User?.fat_percentage || null,
            activity_level: User?.activity_level || "Moderate",
        },
    })

    const shouldBlock = useCallback<BlockerFunction>(() => {
        return methods.formState.isDirty
    }, [methods.formState.isDirty])

    const blocker = useBlocker(shouldBlock)

    useEffect(() => {
        if (User) {
            methods.reset({
                gender: User.gender || "Male",
                age: User.age || 18,
                weight: User.weight || 60,
                height: User.height || 170,
                fat_percentage: User.fat_percentage || null,
                activity_level: User.activity_level || "Moderate",
            })
        }
    }, [User, methods])

    const liveTDEE = useMemo(() => {
        return calculateTDEE(methods.getValues())
    }, [methods.watch()])

    const onSubmit = async (data: BiometricsFormData) => {
        await biometricsManagement(data)
        methods.reset(data)
    }

    return (
        <div className="flex w-full h-full justify-around">
            <FormProvider {...methods}>
                <form
                    className="flex flex-col h-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <BiometricsForm />{" "}
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded self-end"
                    >
                        Guardar
                    </button>
                    {blocker.state === "blocked" ? (
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
                            <div className="p-6 bg-yellow-100 border border-yellow-400 rounded shadow-lg max-w-md w-full opacity-90">
                                <p className="text-yellow-700">
                                    Tienes cambios sin guardar. ¿Estás seguro de
                                    que quieres salir?
                                </p>
                                <div className="flex gap-2 mt-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => blocker.proceed()}
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                    >
                                        Salir sin guardar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => blocker.reset()}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Permanecer aquí
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : blocker.state === "proceeding" ? (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900 bg-opacity-70">
                            <p className="p-6 bg-white rounded shadow-lg text-orange-500">
                                Procesando navegación...
                            </p>
                        </div>
                    ) : null}
                </form>
            </FormProvider>
            <div className="flex w-[40%] h-[30%] self-center bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-3xl">
                {dailyGoal && (
                    <div className="flex flex-col justify-center items-center w-full h-full p-4">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Objetivo Diario
                        </h2>
                        <div className="flex gap-2">
                            <NumberFlow
                                value={
                                    methods.formState.isDirty && liveTDEE
                                        ? Math.floor(liveTDEE)
                                        : Math.floor(dailyGoal.kcal)
                                }
                                className="text-2xl font-bold text-white"
                            />
                            <p className="text-2xl font-bold text-white">
                                Calorías
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Biometrics
