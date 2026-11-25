"use client";

import { Ways_To_Help_interface } from "@/types/types";
import CustomButton from "./CustomButton";
import { useModal } from "../ModalContext";

interface HelpCardProps {
    data: Ways_To_Help_interface;
}

export default function HelpCard({ data }: HelpCardProps) {
    const { openModal } = useModal();

    const handleCardClick = () => {
        if (data.buttonText === "Get Volume 1") {
            openModal("get-copy");
        } else if (data.buttonText === "Gift a Copy") {
            openModal("gift-copy");
        } else if (data.buttonText === "Make a Donation") {
            openModal("donate");
        } else if (data.buttonText === "Become a Partner") {
            openModal("partner");
        } else {
            openModal("get-copy");
        }
    };

    return (
        <div
            className=" h-63 md:h-79.25 w-full bg-background rounded-3xl
         flex flex-col items-center justify-center
        px-6 pt-11 pb-6 md:px-10 relative overflow-hidden "
        >
            <div className="w-full   flex flex-col items-center gap-6 md:gap-10.5 z-10  ">
                <div className="space-y-2 md:space-y-8 ">
                    <h4 className=" font-manrope text-dark font-bold text-xl md:text-2xl ">
                        {" "}
                        {data.heading}{" "}
                    </h4>
                    <p className=" text-sm md:text-base font-manrope text-foreground ">
                        {" "}
                        {data.content}{" "}
                    </p>
                </div>

                <CustomButton
                    onClick={handleCardClick}
                    className="w-full text-lg! ">
                    {data.buttonText}
                </CustomButton>
            </div>

            <div
                style={{
                    backgroundColor: data.spotColor,
                }}
                className=" size-27.5 md:size-36 xl:size-50 rounded-full shrink-0 absolute
-top-11 -right-12
md:-top-15 md:-right-15
                xl:-top-26 xl:-right-15
                 z-0 "
            />
        </div>
    );
}
