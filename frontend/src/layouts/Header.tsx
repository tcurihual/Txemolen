import React from "react"

import { BsPersonCircle } from "react-icons/bs"
import { IoIosArrowDown } from "react-icons/io"

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col h-[100%] ">
            <div className="flex flex-row h-[11%] justify-between items-center px-[4%] border-b-5 border-[#F6F6F6] ">
                <p className="text-[28px]">Inicio</p>
                <div className="flex flex-row items-center gap-[20px]">
                    <div className="w-[50px] h-[50px] rounded-full">
                        <BsPersonCircle className="w-full h-full" />
                    </div>
                    <p className="font-medium text-[20px]">Juan Perez</p>
                    <div className="w-[20px] h-[20px] ">
                        <IoIosArrowDown className="w-full h-full" />
                    </div>
                </div>
            </div>
            <div className="pl-[4%] h-[100%]">{children}</div>
        </div>
    )
}

export default Header
