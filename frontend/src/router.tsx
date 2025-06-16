import React from "react"
import { Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Biometrics from "./pages/Biometrics"
import Calendar from "./pages/Calendar"
import Recipes from "./pages/Recipes"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Login from "./pages/Login"

const WebRouter: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/biometrica"
                element={
                    <ProtectedRoute>
                        <Biometrics />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/calendario"
                element={
                    <ProtectedRoute>
                        <Calendar />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recetas"
                element={
                    <ProtectedRoute>
                        <Recipes />
                    </ProtectedRoute>
                }
            />
            <Route path="/iniciar-sesion" element={<Login />} />
        </Routes>
    )
}

export default WebRouter
