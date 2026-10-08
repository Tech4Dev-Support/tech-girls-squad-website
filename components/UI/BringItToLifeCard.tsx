import { Bring_it_to_life_data_interface } from "@/types/types"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"



interface BringItToLifeCardProps {
    data: Bring_it_to_life_data_interface
}

export default function BringItToLifeCard({ data }: BringItToLifeCardProps) {
    return (
        <div className="w-full max-w-80 md:max-w-104  bg-background h-125 flex flex-col items-start rounded-3xl
         shadow-[0px_4px_4px_0px_#0000001A] overflow-hidden cursor-pointer
         hover:scale-110 duration-200 ease-in-out group
        "  >

            <div className="h-[47%] w-full overflow-hidden bg-dark" >

                <Image
                    src={data.image}
                    alt={`image`}
                    height={1500} width={1500}
                    className=" h-full w-full object-center object-cover "
                />

            </div>


            <div className="h-[53%] w-full flex items-center justify-center p-6  " >

                <div className="w-full h-full flex flex-col items-start justify-between   " >
                    <div>
                        <h5 className="mb-3 text-black font-fredoka font-medium text-xl md:text-2xl " > {data.heading} </h5>
                        <p className="font-normal text-sm md:text-base font-manrope " > {data.paragraph} </p>
                    </div>

                    <Link href={"/"}
                        className="  font-semibold  font-manrope text-base md:text-lg flex items-center justify-start gap-2
                        group-hover:text-primary text-dark
                        "
                    >
                        {data.link_text}
                        <ArrowRight size={18} />
                    </Link>
                </div>

            </div>


        </div>
    )
}