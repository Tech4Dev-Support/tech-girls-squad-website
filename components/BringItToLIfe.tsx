"use client"


import { bring_it_to_life_data } from "@/data/bring_it_to_life_data";
import BringItToLifeCard from "./UI/BringItToLifeCard";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function BringItToLife() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);



    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".bring-it-to-life-card");

            gsap.fromTo(
                cards,
                {
                    y: "200%",
                },
                {
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.2,

                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-section px-4 md:px-16 pt-12 pb-20 flex flex-col items-center gap-8 overflow-hidden "  >

            <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                How We Bring it to Life
            </h2>


            <div
                ref={cardsRef} className=" mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center justify-items-center gap-9.5 "  >
                {bring_it_to_life_data.map((data, i) => (
                    <div
                        key={i}
                        className="bring-it-to-life-card w-full"
                    >
                        <BringItToLifeCard data={data} />
                    </div>
                ))}
            </div>

        </section>
    )
}