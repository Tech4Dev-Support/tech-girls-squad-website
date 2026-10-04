"use client"

import { navlinks } from "@/data/nav_data";
import CustomButton from "./UI/CustomButton";
import Logo from "./UI/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";




export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)



    // This handles the scroll observer
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [])




    // Prevent scrolling when the mobile navbar is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showMobileMenu]);





    return (
        <>
            <nav className={`
        w-full px-6 md:px-16 py-3.5
        flex items-center justify-between
        fixed top-0 left-0 transition-all duration-300 ease-in-out
${scrolled ? "bg-background " : "bg-transparent"}
        z-20
        `} >
                <Logo />




                <div className=" w-fit hidden md:flex items-center justify-start  gap-6  " >

                    <ul className="w-fit flex items-center gap-6 "  >
                        {
                            navlinks.map((link, i) => (
                                <li key={i} className={`
                            text-base font-semibold
                            font-manrope cursor-pointer  transition-all duration-100 ease-in-out
                            ${scrolled ? "text-dark " : "text-background"}
                            `} >
                                    <Link href={link.path} className=" hover:text-primary transition-all duration-200 ease-in-out " >
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>


                    <CustomButton variant="primary" >
                        Get Volume 1
                    </CustomButton>
                </div>




                {/* Menu button */}
                <button
                    onClick={() => setShowMobileMenu((prev) => !prev)}
                    className="relative flex h-8 w-8 items-center justify-center md:hidden cursor-pointer"
                >
                    {/* Top / first bar */}
                    <span
                        className={`absolute h-0.75 w-7 rounded-3xl
            ${scrolled ? "bg-primary" : "bg-background"}
            transition-transform duration-300
            ${showMobileMenu ? "rotate-45" : "-translate-y-1.5"}
        `}
                    />

                    {/* Middle bar */}
                    <span
                        className={`absolute h-0.75 w-7 rounded-3xl
            ${scrolled ? "bg-primary" : "bg-background"}
            transition-opacity duration-200
            ${showMobileMenu ? "opacity-0" : "opacity-100"}
        `}
                    />

                    {/* Bottom bar */}
                    <span
                        className={`absolute h-0.75 w-7 rounded-3xl
            ${scrolled ? "bg-primary" : "bg-background"}
            transition-transform duration-300
            ${showMobileMenu ? "-rotate-45" : "translate-y-1.5"}
        `}
                    />
                </button>


            </nav>






            {/* Mobile menu  */}
            <div className={`fixed top-0 left-0 bg-white w-[75%]  h-full z-20
            transition-transform duration-300 ease-in-out
            px-4 py-12 flex flex-col gap-14 items-start justify-stretch
                ${showMobileMenu ? " translate-x-0 " : "-translate-x-full "}
                 `} >

                <Logo />



                <div className=" w-full flex flex-col items-start justify-between  gap-6  h-full max-h-[400px] " >

                    <ul className="w-fit flex flex-col items-start gap-6 "  >
                        {
                            navlinks.map((link, i) => (
                                <li
                                    onClick={() => setShowMobileMenu(false)}
                                    key={i} className={`
                            text-xl font-semibold
                            font-manrope cursor-pointer  transition-all duration-100 ease-in-out
text-primary
                            `} >
                                    <Link
                                        href={link.path}
                                        className=" hover:text-primary transition-all duration-200 ease-in-out " >
                                        {link.label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>


                    <CustomButton
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full"
                        variant="primary" >
                        Get Volume 1
                    </CustomButton>
                </div>


            </div>

        </>
    )
}