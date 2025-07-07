import React, { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLoading } from "../contexts/LoadingContext"
import { useModal } from "../contexts/ModalContext"

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { checkAuthentication, HasBio } = useAuth()
    const { withLoading, setLoading } = useLoading()
    const { openModal } = useModal()
    const location = useLocation()

    const [isAuth, setIsAuth] = useState<boolean | null>(null)
    const [bioChecked, setBioChecked] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        const verify = async () => {
            const result = await withLoading(checkAuthentication())
            setIsAuth(result)
        }
        verify().finally(() => setLoading(false))
    }, [location.pathname])

    useEffect(() => {
        if (
            isAuth === true &&
            HasBio === false &&
            location.pathname !== "/biometrica" &&
            !bioChecked
        ) {
            openModal({
                title: "Información requerida",
                component: (
                    <div>
                        <p className="mb-4">
                            Para continuar usando la aplicación, necesitamos que
                            completes tu información biométrica.
                        </p>
                        <p>
                            Serás redirigido a la sección correspondiente para
                            agregar estos datos importantes.
                        </p>
                    </div>
                ),
                size: "md",
                onClose: () => {
                    setBioChecked(true)
                },
            })
        }
    }, [isAuth, HasBio, location.pathname, bioChecked])

    if (isAuth === null) {
        return <></>
    }

    if (isAuth === false) {
        return <Navigate to="/sesion" state={{ from: location }} replace />
    }

    if (HasBio === false && location.pathname !== "/biometrica" && bioChecked) {
        return <Navigate to="/biometrica" replace />
    }

    return <>{children}</>
}
