import type { IconType } from "react-icons/lib"
import { motion } from "motion/react"

interface MenuCardProps {
    icon: IconType
    label: string
    isActive?: boolean
    color?: string
    click: () => void
}

export const MenuCard = ({
    icon: Icon,
    label,
    isActive = false,
    color = "#66C9D8",
    click,
}: MenuCardProps) => {
    return (
        <motion.div
            onClick={click}
            className={`
            flex items-center 
            w-[90%] h-[20%] 
            rounded-r-[20px] 
            ${isActive ? "bg-[#F6F6F6]" : "bg-transparent"}
            hover:bg-[#F6F6F6]
            cursor-pointer
          `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="flex justify-center items-center w-[50px] h-[30px] mx-[10px]">
                <Icon size={30} style={{ color }} />
            </div>

            <div className="flex-1 h-full flex items-center">
                <span className="text-[22px] font-medium" style={{ color }}>
                    {label}
                </span>
            </div>
        </motion.div>
    )
}
