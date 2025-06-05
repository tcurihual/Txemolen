import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"

import Menu from "./layouts/Menu.tsx"
import Header from "./layouts/Header.tsx"
import WebRouter from "./router.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Menu>
                <Header>
                    <WebRouter />
                </Header>
            </Menu>
        </BrowserRouter>
    </StrictMode>
)
