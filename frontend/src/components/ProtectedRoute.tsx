import React, { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLoading } from "../contexts/LoadingContext"

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { checkAuthentication, HasBio } = useAuth()
    const { withLoading, setLoading } = useLoading()
    const location = useLocation()

    const [isAuth, setIsAuth] = useState<boolean | null>(null)

    useEffect(() => {
        setLoading(true)
        const verify = async () => {
            const result = await withLoading(checkAuthentication())
            setIsAuth(result)
        }
        verify().finally(() => setLoading(false))
    }, [location.pathname])

    if (isAuth === null) {
        return <></>
    }

    if (isAuth === false) {
        return <Navigate to="/sesion" state={{ from: location }} replace />
    }

    return <>{children}</>
}
