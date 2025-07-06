import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Biometrics from "./pages/Biometrics"
import Calendar from "./pages/Calendar"
import Recipes from "./pages/Recipes"
import Session from "./pages/Session"
import RootLayout from "./layouts/RootLayout"
import { ProtectedRoute } from "./components/ProtectedRoute"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <RootLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "", element: <Dashboard /> },
            { path: "biometrica", element: <Biometrics /> },
            { path: "calendario", element: <Calendar /> },
            { path: "recetas", element: <Recipes /> },
        ],
    },
    {
        path: "/sesion",
        element: <Session />,
    },
])

const AppRouter = () => {
    return <RouterProvider router={router} />
}

export default AppRouter
