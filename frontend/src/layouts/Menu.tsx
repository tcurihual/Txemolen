import React from "react"
import { useNavigate } from "react-router-dom"

import { IoFitness } from "react-icons/io5"
import { TbLayoutDashboardFilled } from "react-icons/tb"
import { FaWeightScale } from "react-icons/fa6"
import { BsCalendar2Week } from "react-icons/bs"
import { PiBowlFoodFill } from "react-icons/pi"
import { TbLogout2 } from "react-icons/tb"

import { MenuCard } from "../components/MenuCard"

const Menu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate()
    const handleCardClick = (route: string) => {
        navigate(route)
    }
    return (
        <div className="flex w-screen h-screen">
            <div className="flex flex-col w-[15%] py-[1.8%] justify-between border-r-5 border-[#F6F6F6]">
                <div className="flex flex-col w-full h-[49%] gap-y-[11%] py-[7%] ">
                    <div className="flex flex-col self-center">
                        <div className="w-[60px] h-[60px] self-center">
                            <IoFitness className="w-full h-full text-[#FC9997]" />
                        </div>
                        <p className="font-[Merienda] font-bold text-[28px] text-[#FC9997]">
                            Txemolen
                        </p>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                        <MenuCard
                            icon={TbLayoutDashboardFilled}
                            label="Inicio"
                            isActive={location.pathname === "/"}
                            click={() => handleCardClick("/")}
                            color="#66C9D8"
                        />
                        <MenuCard
                            icon={FaWeightScale}
                            label="Biometrica"
                            isActive={location.pathname === "/biometrica"}
                            click={() => handleCardClick("/biometrica")}
                            color="#9DD95A"
                        />
                        <MenuCard
                            icon={BsCalendar2Week}
                            label="Calendario"
                            isActive={location.pathname === "/calendario"}
                            click={() => handleCardClick("/calendario")}
                            color="#B88CFF"
                        />
                        <MenuCard
                            icon={PiBowlFoodFill}
                            label="Recetas"
                            isActive={location.pathname === "/recetas"}
                            click={() => handleCardClick("/recetas")}
                            color="#FFA971"
                        />
                    </div>
                </div>

                <div className="flex flex-row w-[60%] h-[6%] self-center items-center justify-around cursor-pointer">
                    <div className="w-[30px] h-[30px] ">
                        <TbLogout2 className="w-full h-full" />
                    </div>
                    <p className="font-medium text-[20px] text-black">
                        Log Out
                    </p>
                </div>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default Menu
