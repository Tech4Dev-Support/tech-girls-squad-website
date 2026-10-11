"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { impact_stats_data } from "@/data/impact_stats_data";

gsap.registerPlugin(ScrollTrigger);

export default function ImpactStats() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const numberRefs = useRef<(HTMLHeadingElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });

            timeline.fromTo(
                headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );

            timeline.fromTo(
                cardsRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: "power2.out",
                },
                "-=0.3"
            );

            impact_stats_data.forEach((stat, index) => {
                const numElement = numberRefs.current[index];
                if (!numElement) return;

                const counterObj = { value: 0 };

                timeline.to(
                    counterObj,
                    {
                        value: stat.value,
                        duration: 1.8,
                        ease: "power1.out",
                        onUpdate: () => {
                            numElement.innerText = `${Math.round(counterObj.value)}${stat.suffix}`;
                        },
                    },
                    index === 0 ? ">" : "<"
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "user":
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.8282 23.8625C26.2387 22.4662 25.3832 21.1978 24.3095 20.1281C23.2389 19.0553 21.9708 18.2 20.5751 17.6094C20.5626 17.6031 20.5501 17.6 20.5376 17.5938C22.4845 16.1875 23.7501 13.8969 23.7501 11.3125C23.7501 7.03125 20.2813 3.5625 16.0001 3.5625C11.7188 3.5625 8.25008 7.03125 8.25008 11.3125C8.25008 13.8969 9.5157 16.1875 11.4626 17.5969C11.4501 17.6031 11.4376 17.6062 11.4251 17.6125C10.0251 18.2031 8.76883 19.05 7.6907 20.1313C6.6179 21.2018 5.76257 22.4699 5.17195 23.8656C4.59171 25.232 4.27877 26.697 4.25008 28.1812C4.24924 28.2146 4.25509 28.2478 4.26728 28.2788C4.27947 28.3099 4.29776 28.3382 4.32105 28.3621C4.34435 28.386 4.3722 28.4049 4.40294 28.4179C4.43369 28.4308 4.46672 28.4375 4.50008 28.4375H6.37508C6.51258 28.4375 6.62195 28.3281 6.62508 28.1938C6.68758 25.7812 7.65633 23.5219 9.36883 21.8094C11.1407 20.0375 13.4938 19.0625 16.0001 19.0625C18.5063 19.0625 20.8595 20.0375 22.6313 21.8094C24.3438 23.5219 25.3126 25.7812 25.3751 28.1938C25.3782 28.3313 25.4876 28.4375 25.6251 28.4375H27.5001C27.5334 28.4375 27.5665 28.4308 27.5972 28.4179C27.628 28.4049 27.6558 28.386 27.6791 28.3621C27.7024 28.3382 27.7207 28.3099 27.7329 28.2788C27.7451 28.2478 27.7509 28.2146 27.7501 28.1812C27.7188 26.6875 27.4095 25.2344 26.8282 23.8625ZM16.0001 16.6875C14.5657 16.6875 13.2157 16.1281 12.2001 15.1125C11.1845 14.0969 10.6251 12.7469 10.6251 11.3125C10.6251 9.87813 11.1845 8.52812 12.2001 7.5125C13.2157 6.49687 14.5657 5.9375 16.0001 5.9375C17.4345 5.9375 18.7845 6.49687 19.8001 7.5125C20.8157 8.52812 21.3751 9.87813 21.3751 11.3125C21.3751 12.7469 20.8157 14.0969 19.8001 15.1125C18.7845 16.1281 17.4345 16.6875 16.0001 16.6875Z" fill="#353535" />
                    </svg>
                );
            case "book":
                return (
                    <svg width="28" height="31" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.3333 0H4C2.392 0 0 1.06533 0 4V22.6667C0 25.6013 2.392 26.6667 4 26.6667H24V24H4.016C3.4 23.984 2.66667 23.7413 2.66667 22.6667C2.66667 21.592 3.4 21.3493 4.016 21.3333H24V2.66667C24 1.196 22.804 0 21.3333 0ZM21.3333 18.6667H2.66667V4C2.66667 2.92533 3.4 2.68267 4 2.66667H21.3333V18.6667Z" fill="#353535" />
                    </svg>
                );
            case "africa":
                return (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5974 1.21826L7.11053 1.78895L2.50146 7.71482V11.0071L6.01309 14.8699L10.0515 14.0359L13.1243 14.6504L12.4658 17.0208L14.5728 20.8397L13.5193 23.5173L16.0062 30.7814L19.3575 30.2334L22.4302 26.7656L22.6935 24.3513L24.6688 22.8589L24.2737 18.5132L29.4983 11.8261L26.249 12.28L21.2888 3.63257L13.4753 3.10582L12.5974 1.21826ZM28.369 21.2058L27.4689 22.5095L26.6309 22.5405C25.8903 24.0606 25.8435 24.9167 25.7617 26.6997L26.8482 26.9791L28.2139 23.7199L28.369 21.2058Z" fill="#353535" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section
            id="impact"
            ref={sectionRef}
            className="w-full bg-black py-16 sm:py-20 px-4 sm:px-8 md:px-16 overflow-hidden"
        >
            <div>
                <div ref={headerRef} className="mb-10 sm:mb-12 md:mb-14">
                    <h2 className="font-fredoka text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.18] mb-3">
                        Building a future she can see herself in.
                    </h2>
                    <p className="font-manrope text-base sm:text-lg text-gray-300">
                        Tech Girls Squad has reached classrooms, conferences, and communities:
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {impact_stats_data.map((stat, index) => (
                        <div
                            key={stat.id}
                            ref={(el) => {
                                cardsRef.current[index] = el;
                            }}
                            style={{ backgroundColor: stat.bgColor }}
                            className="relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-55 lg:min-h-67 transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer shadow-sm group"
                        >
                            <div className="absolute -top-10 -right-10 sm:-top-12 sm:-right-12 w-40 h-40 sm:w-45 sm:h-45 rounded-full border-14 sm:border-24 border-white/50 bg-transparent pointer-events-none transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 shrink-0">
                                {renderIcon(stat.icon)}
                            </div>
                            <div className="relative z-10 flex flex-col items-start justify-center flex-1  pt-2">
                                <h3
                                    ref={(el) => {
                                        numberRefs.current[index] = el;
                                    }}
                                    className="font-fredoka text-6xl sm:text-7xl lg:text-[100px] font-semibold text-black leading-none tracking-tight"
                                >
                                    0{stat.suffix}
                                </h3>
                                <p className="relative z-10 font-manrope text-base sm:text-lg lg:text-[24px]  text-[#333333] mt-5 sm:mt-7 leading-snug">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
