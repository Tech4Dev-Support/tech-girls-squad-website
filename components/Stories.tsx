"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { stories_data } from "@/data/stories_data";
import StoryCard from "./UI/StoryCard";

gsap.registerPlugin(ScrollTrigger);

export default function Stories() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".story-card");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                },
            });

            // Heading + description
            tl.fromTo(
                headerRef.current,
                {
                    opacity: 0,
                    y: 35,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                }
            );

            // Story cards
            tl.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 100,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.18,
                    ease: "power3.out",
                },
                "-=0.25"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="the_books"
            ref={sectionRef}
            className="px-4 md:px-16 py-20 flex flex-col items-start gap-4 overflow-hidden"
        >
            <div ref={headerRef}>
                <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                    Stories that spark curiosity and inspire possibility.
                </h2>

                <p className="font-manrope text-foreground text-base md:text-lg leading-relaxed">
                    Every Girl Deserves the Chance to Imagine a Different Future.
                </p>
            </div>

            <div
                ref={cardsRef}
                className="w-full grid grid-cols-1 place-items-center justify-center gap-12 mt-10"
            >
                {stories_data.map((story, i) => (
                    <div
                        key={i}
                        className="story-card w-full"
                    >
                        <StoryCard
                            data={story}
                            index={i}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}