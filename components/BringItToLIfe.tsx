"use client"


import { bring_it_to_life_data } from "@/data/bring_it_to_life_data";
import BringItToLifeCard from "./UI/BringItToLifeCard";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";


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
                    duration: 0.4,
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
            className="bg-section px-6 md:px-16 pt-7 pb-10 md:pt-14 md:pb-20 flex items-center justify-center overflow-hidden "  >



            <div className=" bg-a flex flex-col items-start gap-6 md:gap-8 " >
                <h2 className="font-fredoka text-base md:text-lg font-bold text-primary leading-[1.18]">
                    How We Bring it to Life
                </h2>


                <div
                    ref={cardsRef} className=" mt-3
                     flex flex-col items-start
                    md:grid md:grid-cols-2 xl:grid-cols-3 place-items-center justify-items-center gap-9.5 "  >
                    {bring_it_to_life_data.map((data, i) => (
                        <div
                            key={i}
                            className="bring-it-to-life-card w-full"
                        >
                            <BringItToLifeCard data={data} />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}
