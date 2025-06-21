import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { BsPersonCircle } from "react-icons/bs"
import { IoIosArrowDown } from "react-icons/io"
import { useModal } from "../contexts/ModalContext"
import { useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dropdown, setDropdown] = useState(false)
    const [title, setTitle] = useState("")

    const { User } = useAuth()
    const { openModal } = useModal()

    const location = useLocation()

    useEffect(() => {
        if (location.pathname === "/") {
            setTitle("Inicio")
        } else if (location.pathname === "/biometrica") {
            setTitle("Biometrica")
        } else if (location.pathname === "/calendario") {
            setTitle("Calendario")
        } else if (location.pathname === "/recetas") {
            setTitle("Recetas")
        } else {
            setTitle("")
        }
    }, [location.pathname])

    const handleOpenModal = (text: string) => {
        openModal({
            component: <p>{text}</p>,
            title: text,
            size: "lg",
        })
    }

    const handleRotation = () => setDropdown((prev) => !prev)

    const liComponent = (text: string) => (
        <motion.li
            className="px-4 py-2 hover:bg-[#F6F6F6] border-3 border-[#F6F6F6] rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal(text)}
        >
            {text}
        </motion.li>
    )

    return (
        <div className="flex flex-col h-[100%] ">
            <div
                className="flex flex-row h-[11%] justify-between items-center px-[4%] border-b-5 border-[#F6F6F6] cursor-pointer relative"
                onClick={handleRotation}
            >
                <p className="text-[28px]">{title}</p>
                <div className="flex flex-row items-center gap-[20px]">
                    <div className="w-[50px] h-[50px] rounded-full">
                        <BsPersonCircle className="w-full h-full" />
                    </div>
                    <p className="font-medium text-[20px]">{User?.name}</p>
                    <motion.div
                        className="w-[20px] h-[20px]"
                        animate={{ rotate: dropdown ? 180 : 0 }}
                    >
                        <IoIosArrowDown className="w-full h-full" />
                    </motion.div>
                </div>
                <AnimatePresence>
                    {dropdown && (
                        <motion.div
                            className="absolute right-[4%] top-[100%] mt-2 w-[15%] bg-transparent rounded-md z-10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <ul className="flex flex-col gap-3 py-3">
                                {liComponent("Mi Perfil")}
                                {liComponent("Configuración")}
                                {liComponent("Ayuda")}
                                {liComponent("Cerrar sesión")}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="pl-[4%] pr-[4%] h-[100%]">{children}</div>
        </div>
    )
}

export default Header
