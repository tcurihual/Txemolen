import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"

import Menu from "./layouts/Menu.tsx"
import Header from "./layouts/Header.tsx"
import WebRouter from "./router.tsx"
import { ModalProvider } from "./contexts/ModalContext.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ModalProvider>
                <Menu>
                    <Header>
                        <WebRouter />
                    </Header>
                </Menu>
            </ModalProvider>
        </BrowserRouter>
    </StrictMode>
)
