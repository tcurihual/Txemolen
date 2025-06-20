import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"

import Menu from "./layouts/Menu.tsx"
import Header from "./layouts/Header.tsx"
import WebRouter from "./router.tsx"
import { ModalProvider } from "./contexts/ModalContext.tsx"
import { LoadingProvider } from "./contexts/LoadingContext.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <AuthProvider>
                    <ModalProvider>
                        <Menu>
                            <Header>
                                <WebRouter />
                            </Header>
                        </Menu>
                    </ModalProvider>
                </AuthProvider>
            </LoadingProvider>
        </BrowserRouter>
    </StrictMode>
)
