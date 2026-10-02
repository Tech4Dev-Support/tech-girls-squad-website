import { Stories_interface } from "@/types/types"
import Image from "next/image"
import CustomButton from "./CustomButton"


interface StoryCardProps {
    data: Stories_interface,
    index: number
}


export default function StoryCard({ data, index }: StoryCardProps) {
    return (
        <div
            style={{
                backgroundColor: `${data.bg_color}`,
                boxShadow: index + 1 === 2 ? "0px 0px 0px 1px #00000033" : ""
            }}
            className="w-full flex flex-col md:flex-row items-center gap-16 rounded-3xl py-8 md:py-12 px-5 md:px-14 h-full "  >


            <div
                style={{
                    rotate: index + 1 === 1 ? "-3deg" : "",
                    boxShadow: index + 1 === 1 ? "0px 7.74px 3.1px 6.19px #00000040" : "",
                }}
                className="w-fit max-w-[288px]  flex items-center justify-center " >
                <Image
                    src={data.image}
                    alt={`${data.title}-image`}
                    height={1000} width={1000}
                    className="w-55 md:w-65.75 h-auto max-h-[371.7px] object-center object-cover "
                />
            </div>



            <div className="w-full flex flex-col gap-4 md:gap-6 items-start max-w-193.25  " >

                <div className="flex items-center justify-start gap-2 text-primary font-semibold text-sm md:text-lg " >

                    <small>Volume {data.volume} </small>
                    <Dot />
                    <small> {data.status} </small>

                    {data.publication_year && <> <Dot /> <small>Published {data.publication_year} </small></>}

                </div>

                <h3 className="font-fredoka text-[24px] md:text-[28px]  font-semibold text-dark ">{data.title} </h3>

                <p className=" font-manrope text-foreground text-[15px] md:text-lg leading-relaxed">{data.description}</p>

                <div className="w-full flex flex-col md:flex-row md:items-center gap-4 mt-3 " >
                    {data.status === "Available" ? (<>
                        <CustomButton className="w-fit! py-3! px-6! text-sm! md:text-lg! " > Get Volume 1 </CustomButton>
                        <CustomButton variant="outline" className="w-fit! border-dark! text-dark! py-3! px-6! text-sm! md:text-lg! " > Order for Your School </CustomButton>
                    </>) : (
                        <CustomButton variant="outline" className="w-fit! border-dark! text-dark! py-3! px-6! text-sm! md:text-lg! " > Fund the  Next Volume </CustomButton>
                    )}
                </div>

            </div>


        </div >
    )
}


const Dot = () => {
    return (
        <div className=" size-1 md:size-1.25 bg-primary rounded-full shrink-0 " />
    )
}