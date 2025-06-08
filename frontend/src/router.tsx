import React from "react"
import { Routes, Route } from "react-router-dom"

const WebRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<div>Inicio</div>} />
        </Routes>
    )
}

export default WebRouter
