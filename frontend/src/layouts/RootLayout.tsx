import { Outlet } from "react-router-dom"
import Menu from "./Menu"
import Header from "./Header"

const RootLayout = () => {
    return (
        <Menu>
            <Header>
                <Outlet />
            </Header>
        </Menu>
    )
}

export default RootLayout
