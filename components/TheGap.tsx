"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TheGap() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });

            timeline
                .fromTo(
                    textRef.current,
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                    }
                )
                .fromTo(
                    imageRef.current,
                    {
                        opacity: 0,
                        y: 60,
                        scale: 0.95,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out",
                    },
                    "-=0.7"
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full bg-background py-12 md:py-16 px-4 md:px-16 overflow-hidden"
        >
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">

                {/* Text */}
                <div
                    ref={textRef}
                    className="flex flex-col items-start w-full max-w-175.75"
                >
                    <span className="font-manrope text-primary font-semibold text-base md:text-lg tracking-tight mb-2 md:mb-3">
                        The Gap
                    </span>

                    <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18] mb-6">
                        Every girl deserves the <br className="hidden sm:inline" />
                        chance to see herself in <br className="hidden sm:inline" />
                        STEM.
                    </h2>

                    <div className="space-y-6 font-manrope text-foreground text-base md:text-lg leading-relaxed">
                        <p>
                            The stories girls encounter while growing up influence how they see themselves
                            and what they believe is possible. For many girls, technology can feel distant or
                            unfamiliar, because they rarely see characters, role models, or experiences that
                            reflect them.
                        </p>

                        <p>
                            Tech Girls Squad helps bridge that gap by introducing technology through stories
                            that encourage curiosity, build confidence, and help girls see themselves as
                            creators, risk-takers, and innovators shaping Africa&apos;s digital future.
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div
                    ref={imageRef}
                    className="flex justify-center items-center w-full"
                >
                    <div className="relative w-full max-w-72 md:max-w-80.75">
                        <Image
                            src="/landing_page_assets/girlsgroup.png"
                            alt="Tech Girls Squad characters standing together"
                            width={550}
                            height={500}
                            className="w-full h-auto object-contain transition-transform duration-500 ease-out hover:scale-[1.03] hover:-translate-y-1.5 cursor-pointer"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}