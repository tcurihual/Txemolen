import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { motion, AnimatePresence } from "motion/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, registerFormSchema } from "../utils/validations"
import FormInput from "../components/inputForm"

const formVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
}

const Session: React.FC = () => {
    const { login, register, AuthError } = useAuth()
    const [redirect, setRedirect] = React.useState<boolean>(false)
    const [isLogin, setIsLogin] = React.useState(true)

    const loginForm = useForm({
        resolver: zodResolver(loginFormSchema),
    })

    const registerForm = useForm({
        resolver: zodResolver(registerFormSchema),
    })

    useEffect(() => {
        if (AuthError?.instance === "Login") {
            loginForm.setError("root", { message: `${AuthError?.message}` })
        } else if (AuthError?.instance === "Register") {
            registerForm.setError("root", { message: `${AuthError?.message}` })
        }
    }, [AuthError])

    useEffect(() => {
        if (redirect) {
            loginForm.clearErrors("root")
            registerForm.clearErrors("root")
        }
    }, [redirect])

    return (
        <>
            {redirect && <Navigate to="/" />}
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
                                {!!AuthError &&
                                    AuthError.instance === "Login" &&
                                    loginForm.formState.errors.root && (
                                        <p className="text-[14px] text-red-600 text-center pb-3">
                                            {
                                                loginForm.formState.errors.root
                                                    .message
                                            }
                                        </p>
                                    )}
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
                                    error={
                                        registerForm.formState.errors.password
                                    }
                                />
                                <FormInput
                                    label="Verificar Contraseña"
                                    name="password"
                                    placeholder="Repita su contraseña"
                                    register={registerForm.register(
                                        "verifyPassword"
                                    )}
                                    error={
                                        registerForm.formState.errors
                                            .verifyPassword
                                    }
                                />
                                {!!AuthError &&
                                    AuthError.instance === "Register" &&
                                    registerForm.formState.errors.root && (
                                        <p className="text-[14px] text-red-600 text-center pb-3">
                                            {
                                                registerForm.formState.errors
                                                    .root.message
                                            }
                                        </p>
                                    )}
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
        </>
    )
}

export default Session
