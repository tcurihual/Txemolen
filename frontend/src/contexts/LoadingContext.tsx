import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react"

type LoadingContextType = {
    isLoading: boolean
    setLoading: (state: boolean) => void
    withLoading: <T>(promise: Promise<T>) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const setLoading = (state: boolean) => {
        setIsLoading(state)
    }

    const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
        try {
            setIsLoading(true)
            const result = await promise
            return result
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading, withLoading }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-xs flex-col gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    cargando...
                </div>
            )}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error("useLoading debe usarse dentro de un LoadingProvider")
    }
    return context
}
