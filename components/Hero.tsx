import Image from "next/image";
import CustomButton from "./UI/CustomButton";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="w-full bg-background min-h-[110svh] md:min-h-svh relative "  >

            <Image
                fill
                alt=""
                aria-hidden="true"
                priority
                sizes="100vw"
                src="/landing_page_assets/hero.gif"
                className="w-full h-full absolute object-center object-cover inset-0 z-0 " />


            <div className="bg-[#00000080] h-full w-full absolute inset-0 z-10  flex flex-col items-start justify-center px-4 md:px-16   " >


                <div className="w-full max-w-208.75 flex flex-col items-start gap-8" >

                    <h1
                        id="hero-heading"
                        className="font-fredoka text-4xl md:text-7xl text-background font-bold leading-10 md:leading-20 " >What if the next great African Innovator is a <span className="text-primary " >girl </span>
                        who just needs the right story? </h1>

                    <p className="font-manrope text-background text-base md:text-lg font-medium " >Tech Girls Squad uses engaging stories to introduce girls to STEM and
                        inspire girls to see themselves as creators, innovators, and future leaders.</p>


                    <div className="w-full flex flex-col md:flex-row md:items-center gap-4 " >
                        <CustomButton variant="primary">
                            Get Volume 1
                        </CustomButton>

                        <CustomButton variant="outline">
                            Explore the impact

                            <span
                                aria-hidden="true"
                                className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current">
                                <ArrowRight size={18} strokeWidth={2} />
                            </span>
                        </CustomButton>
                    </div>

                </div>


            </div>

        </section>
    )
}