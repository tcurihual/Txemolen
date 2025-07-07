import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"
import Cookies from "js-cookie"

import {
    SERVER_URL,
    type AuthError,
    type LoginFormData as LoginData,
    type RegisterFormData,
    type User,
    type UserResponse,
} from "../utils/types"
import { useLoading } from "./LoadingContext"

type AuthContextType = {
    isAuthenticated: boolean | null
    User: UserResponse | undefined
    AuthError: AuthError | undefined
    HasBio: boolean | undefined
    checkAuthentication: () => Promise<boolean>
    authenticatedFetch: (
        url: string,
        options?: RequestInit
    ) => Promise<Response>
    login: (login_data: LoginData) => Promise<void>
    register: (user_data: RegisterFormData) => Promise<void>
    logout: () => void
    updateVars: (newUser: UserResponse) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [User, setUser] = useState<UserResponse | undefined>(undefined)
    const [AuthError, setError] = useState<AuthError | undefined>(undefined)
    const [HasBio, setHasBio] = useState<boolean | undefined>(undefined)
    const { withLoading } = useLoading()

    const createAuthHeaders = (options?: RequestInit): HeadersInit => {
        const headers = new Headers(options?.headers)

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json")
        }

        const token = Cookies.get("token")
        if (token && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`)
        }

        return headers
    }

    const authenticatedFetch = async (
        endpoint: string,
        options?: RequestInit
    ): Promise<Response> => {
        const url = `${SERVER_URL}${endpoint}`
        const finalHeaders = createAuthHeaders(options)

        const response = await fetch(url, {
            ...options,
            headers: finalHeaders,
        })
        if (response.status === 401) {
            logout()
        }
        return response
    }

    const verifyToken = async () => {
        return withLoading(
            authenticatedFetch("/auth/validate", { method: "GET" }).then(
                async (response) => {
                    if (!response.ok) return false
                    const data: User = await response.json()
                    setUser(data)
                    setHasBio(!!data.daily_goal_id)
                    return true
                }
            )
        )
    }

    const checkAuthentication = async () => {
        const token = Cookies.get("token")
        if (!token) {
            setIsAuthenticated(false)
            return false
        }
        return withLoading(verifyToken())
            .then((isValid) => {
                setIsAuthenticated(isValid)
                return isValid
            })
            .catch(() => {
                setIsAuthenticated(false)
                return false
            })
    }

    useEffect(() => {
        let isActive = true
        checkAuthentication().then((isValid) => {
            if (isActive && !isValid) {
                Cookies.remove("token")
                setUser(undefined)
                setHasBio(undefined)
            }
        })
        return () => {
            isActive = false
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) setError(undefined)
    }, [isAuthenticated])

    const login = async (login_data: LoginData) => {
        return withLoading(
            fetch(`${SERVER_URL}/auth/login`, {
                method: "POST",
                headers: createAuthHeaders(),
                body: JSON.stringify(login_data),
            }).then(async (response) => {
                if (!response.ok) {
                    const AuthError: AuthError = {
                        instance: "Login",
                        message: await response.text(),
                    }
                    setError(AuthError)
                    throw new Error("Error al iniciar sesion")
                }
                const data = await response.json()
                Cookies.set("token", data.token, {
                    secure: true,
                    sameSite: "strict",
                })
                setIsAuthenticated(true)
            })
        )
    }

    const register = async (user_data: RegisterFormData) => {
        return withLoading(
            fetch(`${SERVER_URL}/auth/register`, {
                method: "POST",
                headers: createAuthHeaders(),
                body: JSON.stringify(user_data),
            }).then(async (response) => {
                if (!response.ok) {
                    const AuthError: AuthError = {
                        instance: "Register",
                        message: await response.text(),
                    }
                    setError(AuthError)
                    throw new Error("Error al registrarse")
                }
                const data = await response.json()
                Cookies.set("token", data.token, {
                    secure: true,
                    sameSite: "strict",
                    expires: 7,
                })
                setIsAuthenticated(true)
            })
        )
    }

    const logout = () => {
        Cookies.remove("token")
        setIsAuthenticated(false)
        setUser(undefined)
        setHasBio(undefined)
    }

    const updateVars = (newUser: UserResponse) => {
        if (newUser) {
            setUser(newUser)
            if (newUser.daily_goal_id) setHasBio(true)
            else setHasBio(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                User,
                AuthError,
                HasBio,
                authenticatedFetch,
                checkAuthentication,
                login,
                register,
                logout,
                updateVars,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider")
    }
    return context
}
