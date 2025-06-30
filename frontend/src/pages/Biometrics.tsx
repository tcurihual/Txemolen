import { FormProvider, useForm } from "react-hook-form"
import { BiometricsForm } from "../components/BiometricsForm"
import { useAuth } from "../contexts/AuthContext"
import type { BiometricsFormData } from "../utils/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { biometricsFormSchema } from "../utils/validations"
import { useModal } from "../contexts/ModalContext"
import { useLoading } from "../contexts/LoadingContext"
import { useEffect } from "react"
import { useBiometrics } from "../contexts/BioContext"

interface BiometricsFormContainerProps {
    isModal?: boolean
}

export const BiometricsFormContainer: React.FC<
    BiometricsFormContainerProps
> = ({ isModal }) => {
    const { User } = useAuth()
    const { biometricsManagement } = useBiometrics()
    const { closeModal } = useModal()
    const { withLoading } = useLoading()

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

    const onSubmit = async (data: BiometricsFormData) => {
        await biometricsManagement(data).then((response) => {
            console.log(response)
        })
    }

    return (
        <FormProvider {...methods}>
            <form
                className={`flex flex-col h-full ${isModal ? "w-full" : "w-[45%]"}`}
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <BiometricsForm />{" "}
                <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded self-end"
                >
                    Guardar
                </button>
            </form>
        </FormProvider>
    )
}

const Biometrics: React.FC = () => {
    return (
        <div className="flex w-full h-full justify-between">
            <BiometricsFormContainer />
            <div className="flex w-[65%]">hola</div>
        </div>
    )
}

export default Biometrics
