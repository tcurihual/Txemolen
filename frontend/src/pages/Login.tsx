import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
    const { login } = useAuth()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [redirect, setRedirect] = React.useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login({ email, password }).then(() => {
            setRedirect(true)
        })
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
            <div className="flex flex-col bg-white p-8 rounded-xl shadow-2xl w-[35%] h-[40%] justify-around">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Iniciar sesión
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Ingrese su email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
