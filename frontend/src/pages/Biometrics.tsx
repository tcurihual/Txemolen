import { FormProvider, useForm } from "react-hook-form"
import { BiometricsForm } from "../components/BiometricsForm"
import { useAuth } from "../contexts/AuthContext"
import type { BiometricsFormData } from "../utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { biometricsFormSchema } from "../utils/validations"

const Biometrics: React.FC = () => {
    const { User } = useAuth()
    const methods = useForm<BiometricsFormData>({
        resolver: zodResolver(biometricsFormSchema),
        defaultValues: {
            gender: User?.gender || "Male",
            age: User?.age || 0,
            weight: User?.weight || 0,
            height: User?.height || 0,
            fat_percentage: User?.fat_percentage || 0,
        },
    })

    const onSubmit = (data: BiometricsFormData) => {
        console.log(data)
    }

    return (
        <div className="flex w-full h-full justify-between">
            <FormProvider {...methods}>
                <form
                    className="w-full h-full"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <BiometricsForm />
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Guardar
                    </button>
                </form>
            </FormProvider>
        </div>
    )
}

export default Biometrics
