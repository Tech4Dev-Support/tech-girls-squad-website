"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function TheGap() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full bg-background py-12 md:py-16 px-4 md:px-16 overflow-hidden"
        >
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div
                    className={`flex flex-col items-start w-full max-w-[700px] transition-all duration-[1400ms] ease-out ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <span className="font-manrope text-primary font-semibold text-lg md:text-xl tracking-tight mb-2 md:mb-3">
                        The Gap 
                    </span> 

                    <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18] mb-6">
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
                <div
                    className={`flex justify-center items-center w-full transition-all duration-[1400ms] delay-300 ease-out ${
                        isVisible
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-12 scale-95"
                    }`}
                >
                    <div className="relative w-full max-w-[400px] lg:max-w-[400px]"> 
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




