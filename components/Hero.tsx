"use client";

import Image from "next/image";
import CustomButton from "./UI/CustomButton";
import { ArrowRight } from "lucide-react";
import { useModal } from "./ModalContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
    const { openModal } = useModal();
    const [gifLoaded, setGifLoaded] = useState(false);
    const gifRef = useRef<HTMLImageElement>(null);



    useEffect(() => {
        if (gifRef.current?.complete) setGifLoaded(true);
    }, []);


    return (
        <section className="w-full bg-background min-h-[110svh] md:min-h-svh relative "  >

            {/* 1. Static poster: small, loads fast, shown immediately */}
            <Image
                fill
                alt=""
                aria-hidden="true"
                priority
                sizes="100vw"
                src="/landing_page_assets/first_frame.jpeg"
                className="absolute inset-0 z-0 object-cover object-center"
            />

            {/* 2. GIF: sits on top, invisible until fully loaded, then fades in */}
            <Image
                ref={gifRef}
                fill
                alt=""
                aria-hidden="true"
                unoptimized
                sizes="100vw"
                src="/landing_page_assets/hero.gif"
                onLoad={() => setGifLoaded(true)}
                className={`absolute inset-0 z-0 object-cover object-center transition-opacity duration-700 ${gifLoaded ? "opacity-100" : "opacity-0"
                    }`}
            />


            <div className="bg-[#00000080] h-full w-full absolute inset-0 z-10  flex flex-col items-start justify-center px-4 md:px-16   " >


                <div className="w-full max-w-211 flex flex-col items-start gap-5 md:gap-8" >

                    <h1
                        id="hero-heading"
                        className="font-fredoka text-4xl md:text-7xl text-background font-bold leading-10 md:leading-20 " >What if the next great African Innovator is a
                        {" "} <span className="bg-primary rounded-[14px] py-0.5 px-1.5 " > girl </span>{" "}
                        {" "}  who just needs the right story? </h1>

                    <p className=" max-w-174.5 font-manrope text-background text-lg font-medium " >Tech Girls Squad uses engaging stories to inspire girls to see themselves as future leaders in STEM.</p>


                    <div className=" w-full md:w-full mx-auto md:mx-0 flex flex-col md:flex-row md:items-center gap-4 " >
                        <CustomButton
                            className="text-lg! w-full md:max-w-61.25 "
                            onClick={() => openModal("get-copy")}
                            variant="primary">
                            Get Volume 1
                        </CustomButton>

                        <Link
                            href={"#impact"}
                            className="w-full md:max-w-61.25 hidden md:block " >
                            <CustomButton
                                className="text-lg!"
                                variant="outline">
                                Explore the impact

                                <span
                                    aria-hidden="true"
                                    className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current">
                                    <ArrowRight size={18} strokeWidth={2} />
                                </span>
                            </CustomButton>
                        </Link>
                    </div>

                </div>


            </div>

        </section>
    )
}