import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const Biometrics: React.FC = () => {
    const { User } = useAuth()
    const [gender, setGender] = useState<"Male" | "Female">("Male")

    console.log(User)
    return (
        <div className="flex w-full h-full justify-between">
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold mb-4">Biometría</h1>
                <p className="text-lg">
                    Aquí podrás ver y gestionar tus datos biométricos.
                </p>
            </div>
            <div className="flex w-[40%] h-[95%] justify-center self-center rounded-xl border-8 border-[#F6F6F6] ">
                {gender === "Male" ? (
                    <img
                        src="/male.jpeg"
                        className="self-center w-[45%] aspect-auto"
                    />
                ) : (
                    <img
                        src="/female.jpeg"
                        className="self-center w-[37%] aspect-auto"
                    />
                )}
            </div>
        </div>
    )
}

export default Biometrics
