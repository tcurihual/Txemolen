import React from "react"

import { IoScale } from "react-icons/io5"
import { BiSolidCake } from "react-icons/bi"
import { GiWeightScale } from "react-icons/gi"

import { useAuth } from "../contexts/AuthContext"
import { BiometricsInput } from "../components/inputForm"
import { TbRulerMeasure2 } from "react-icons/tb"
import { FaTint } from "react-icons/fa"

const Biometrics: React.FC = () => {
    const { User } = useAuth()

    console.log(User)
    return (
        <div className="flex w-full h-full justify-between">
            <div className="flex flex-col self-center items-center justify-evenly h-[80%] w-[60%]">
                <BiometricsInput Icon={IoScale} color="purple" rightText="FM" />
                <BiometricsInput
                    Icon={BiSolidCake}
                    color="pink"
                    rightText="Age"
                />
                <BiometricsInput
                    Icon={GiWeightScale}
                    color="red"
                    rightText="Kg"
                />
                <BiometricsInput
                    Icon={TbRulerMeasure2}
                    color="green"
                    rightText="cm"
                />
                <BiometricsInput Icon={FaTint} color="yellow" rightText="%" />
            </div>
            <div className="flex w-[35%] h-[80%] justify-center self-center rounded-xl border-8 border-[#F6F6F6] ">
                data
            </div>
        </div>
    )
}

export default Biometrics
