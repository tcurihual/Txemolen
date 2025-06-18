import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "motion/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, registerSchema } from "../utils/validations"
import FormInput from "../components/inputForm"

const formVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
}

const Session: React.FC = () => {
    const { login, register } = useAuth()
    const [redirect, setRedirect] = React.useState<boolean>(false)
    const [isLogin, setIsLogin] = React.useState(true)

    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
    })

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
    })

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
            <div className="flex flex-col bg-white p-8 rounded-xl shadow-2xl w-[25%] min-h-[45%] max-h-[80%] overflow-y-auto justify-around">
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 rounded-l ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setIsLogin(true)}
                        type="button"
                    >
                        Iniciar sesión
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setIsLogin(false)}
                        type="button"
                    >
                        Registrarse
                    </button>
                </div>
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="login"
                            onSubmit={loginForm.handleSubmit((data) => {
                                login(data).then(() => setRedirect(true))
                            })}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Iniciar sesión
                            </h2>
                            <FormInput
                                label="Email"
                                name="email"
                                placeholder="Ingrese su email"
                                register={loginForm.register("email")}
                                error={loginForm.formState.errors.email}
                            />
                            <FormInput
                                label="Contraseña"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                register={loginForm.register("password")}
                                error={loginForm.formState.errors.password}
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                            >
                                Iniciar sesión
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="register"
                            onSubmit={registerForm.handleSubmit((data) => {
                                register(data).then(() => setRedirect(true))
                            })}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                Registrarse
                            </h2>
                            <FormInput
                                label="Nombre"
                                name="name"
                                placeholder="Ingrese su nombre completo"
                                register={registerForm.register("name")}
                                error={registerForm.formState.errors.name}
                            />
                            <FormInput
                                label="Email"
                                name="email"
                                placeholder="Ingrese su email"
                                register={registerForm.register("email")}
                                error={registerForm.formState.errors.email}
                            />
                            <FormInput
                                label="Contraseña"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                register={registerForm.register("password")}
                                error={registerForm.formState.errors.password}
                            />
                            <FormInput
                                label="Género"
                                name="gender"
                                placeholder="Ingrese su género"
                                register={registerForm.register("gender")}
                                error={registerForm.formState.errors.gender}
                            />
                            <FormInput
                                label="Edad"
                                name="age"
                                placeholder="Ingrese su edad"
                                register={registerForm.register("age", {
                                    valueAsNumber: true,
                                })}
                                error={registerForm.formState.errors.age}
                            />
                            <FormInput
                                label="Peso (Kg)"
                                name="weight"
                                placeholder="Ingrese su peso en Kg"
                                register={registerForm.register("weight", {
                                    valueAsNumber: true,
                                })}
                                error={registerForm.formState.errors.weight}
                            />
                            <FormInput
                                label="Altura (cm)"
                                name="height"
                                placeholder="Ingrese su altura en cm"
                                register={registerForm.register("height", {
                                    valueAsNumber: true,
                                })}
                                error={registerForm.formState.errors.height}
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                            >
                                Registrarse
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Session
