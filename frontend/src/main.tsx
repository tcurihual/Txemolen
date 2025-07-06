import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import AppRouter from "./router.tsx"

import { ModalProvider } from "./contexts/ModalContext.tsx"
import { LoadingProvider } from "./contexts/LoadingContext.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import { BiometricsProvider } from "./contexts/BioContext.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingProvider>
            <AuthProvider>
                <BiometricsProvider>
                    <ModalProvider>
                        <AppRouter />
                    </ModalProvider>
                </BiometricsProvider>
            </AuthProvider>
        </LoadingProvider>
    </StrictMode>
)
