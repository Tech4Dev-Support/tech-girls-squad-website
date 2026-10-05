"use client"

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopBtn() {
    const [scrolled, setScrolled] = useState(false)

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }




    // This handles the scroll observer
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 200)
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [])


    return (
        <button
            onClick={scrollToTop}
            className={`
             fixed z-30 bg-primary bottom-4 right-5 md:right-10 rounded-full
        border border-[#BE5492] size-12 md:size-15 flex items-center justify-center cursor-pointer
         hover:scale-90 transition-all duration-100 ease-in-out
         ${scrolled ? "opacity-100 " : "opacity-0"}
            `} >
            <ArrowUp color="#ffffff" />
        </button>
    )
}