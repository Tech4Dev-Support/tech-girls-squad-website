import { Ways_To_Help_interface } from "@/types/types"
import CustomButton from "./CustomButton"


interface HelpCardProps {
    data: Ways_To_Help_interface
}


export default function HelpCard({ data }: HelpCardProps) {
    return (
        <div className=" h-full w-full bg-background rounded-3xl flex flex-col items-center justify-center py-15 px-5 md:px-10 relative overflow-hidden " >



            <div className="w-full gap-15 md:gap-20 lg:gap-28.5 flex flex-col items-center z-10  " >
                <div className="space-y-8 " >
                    <h4 className=" font-manrope text-dark font-bold text-xl md:text-2xl " > {data.heading} </h4>
                    <p className=" text-base md:text-lg font-manrope text-foreground " > {data.content} </p>
                </div>


                <CustomButton className="w-full " >
                    {data.buttonText}
                </CustomButton>
            </div>




            <div
                style={{
                    backgroundColor: data.spotColor
                }}
                className=" size-32 md:size-36 xl:size-50 rounded-full shrink-0 absolute
-top-6 -right-12
md:-top-15 md:-right-15
                xl:-top-20 xl:-right-15
                 z-0 " />

        </div>
    )
}