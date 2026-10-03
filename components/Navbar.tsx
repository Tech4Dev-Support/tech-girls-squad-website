"use client"

import { navlinks } from "@/data/nav_data";
import CustomButton from "./UI/CustomButton";
import Logo from "./UI/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [])


    return (
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


            <button className=" flex md:hidden  " >
                buur
            </button>

        </nav>
    )
}