"use client"

import { navlinks } from "@/data/nav_data";
import CustomButton from "./UI/CustomButton";
import Logo from "./UI/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useModal } from "./ModalContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { openModal } = useModal();

    // This handles the scroll observer
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
            <nav
                className={`
        w-full px-5 md:px-16 py-2.5 md:py-3.5
        flex items-center justify-between
        fixed top-0 left-0 transition-all duration-300 ease-in-out
        ${scrolled ? "bg-background" : "bg-transparent"}
        z-50
    `}
            >

                <Logo />

                <div className=" w-fit hidden md:flex items-center justify-start  gap-6  ">
                    <ul className="w-fit flex items-center gap-6 ">
                        {navlinks.map((link, i) => (
                            <li
                                key={i}
                                className={`
                            text-base font-semibold
                            font-manrope cursor-pointer  transition-all duration-100 ease-in-out
                            ${scrolled ? "text-dark " : "text-background"}
                            `}
                            >
                                <Link
                                    href={link.path}
                                    className=" hover:text-primary transition-all duration-200 ease-in-out "
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <CustomButton
                        onClick={() => openModal("get-copy")}
                        variant="primary"
                    >
                        Get Volume 1
                    </CustomButton>
                </div>

                {/* Menu button */}
                <button
                    onClick={() => setShowMobileMenu((prev) => !prev)}
                    className="relative z-60 flex h-8 w-8 items-center justify-center md:hidden cursor-pointer"
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





            {/* overlay  */}
            {showMobileMenu && <div className=" fixed inset-0 h-dvh w-full     z-21  bg-black/50" />}




            {/* Mobile menu  */}
            < div
                className={`
        fixed top-0 left-0 w-full h-dvh z-40 md:hidden
        transition-all duration-300 ease-in-out shadow-[0px_8px_24px_0px_#00000026]
        ${showMobileMenu
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "-translate-y-full opacity-0 pointer-events-none"
                    }
    `}
            >
                <div className="
        w-full bg-white mt-16.5 px-6 pt-2 pb-6
        flex flex-col items-start justify-between
        gap-6 h-fit
    ">
                    <ul className="w-full flex flex-col items-start gap-2">
                        {navlinks.map((link, i) => (
                            <li
                                onClick={() => setShowMobileMenu(false)}
                                key={i}
                                className="   cursor-pointer
                                border-b border-section w-full
                                "
                            >
                                <Link
                                    className=" w-full block h-full text-lg font-normal font-manrope
                                    py-4  text-black tracking-[2%]
                                    "
                                    href={link.path}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <CustomButton
                        onClick={() => {
                            setShowMobileMenu(false);
                            openModal("get-copy");
                        }}
                        className="w-full! text-lg! mb-6"
                        variant="primary"
                    >
                        Get Volume 1
                    </CustomButton>
                </div>
            </div >
        </>
    );
}
