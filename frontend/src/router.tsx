import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Biometrics from "./pages/Biometrics"
import Calendar from "./pages/Calendar"
import Recipes from "./pages/Recipes"

const WebRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/biometrica" element={<Biometrics />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/recetas" element={<Recipes />} />
        </Routes>
    )
}

export default WebRouter
