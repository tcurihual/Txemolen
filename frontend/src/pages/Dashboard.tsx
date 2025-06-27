import React from "react"
import { useAuth } from "../contexts/AuthContext"

const Dashboard: React.FC = () => {
    const { User } = useAuth()
    console.log(User)
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold mb-4">Bienvenido al Dashboard</h1>
            <p className="text-lg">
                Aquí encontrarás información relevante y herramientas útiles.
            </p>
        </div>
    )
}

export default Dashboard
