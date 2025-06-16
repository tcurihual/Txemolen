import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"
import Cookies from "js-cookie"

import { SERVER_URL, type LoginData, type UserDTO } from "../utils/types"
import { useLoading } from "./LoadingContext"

type AuthContextType = {
    isAuthenticated: boolean
    checkAuthentication: () => Promise<boolean>
    login: (login_data: LoginData) => Promise<void>
    register: (user_data: UserDTO) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const { withLoading } = useLoading()

    const verifyToken = async (token: string) => {
        return withLoading(
            fetch(`${SERVER_URL}/auth/validate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (!response.ok) return false
                return true
            })
        )
    }

    const checkAuthentication = async () => {
        const token = Cookies.get("token")
        if (!token) {
            setIsAuthenticated(false)
            return false
        }
        return withLoading(verifyToken(token))
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
            }
            console.log(SERVER_URL)
        })
        return () => {
            isActive = false
        }
    }, [])

    if (isAuthenticated === null) {
        return null
    }

    const login = async (login_data: LoginData) => {
        return withLoading(
            fetch(`${SERVER_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login_data),
            }).then(async (response) => {
                if (!response.ok) throw new Error("Error al iniciar sesión")
                const data = await response.json()
                Cookies.set("token", data.token, {
                    secure: true,
                    sameSite: "strict",
                })
                setIsAuthenticated(true)
            })
        )
    }

    const register = async (user_data: UserDTO) => {
        return withLoading(
            fetch(`${SERVER_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user_data),
            }).then(async (response) => {
                if (!response.ok) throw new Error("Error al registrarse")
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
    }

    return (
        <AuthContext.Provider
            value={{
                checkAuthentication,
                isAuthenticated,
                login,
                register,
                logout,
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
