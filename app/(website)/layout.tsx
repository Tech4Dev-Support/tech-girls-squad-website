"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import { ModalProvider } from "@/components/ModalContext";
import GlobalModals from "@/components/GlobalModals";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            <div className="min-h-full flex flex-col relative ">
                <Navbar />
                {children}
                <Footer />
                <ScrollToTopBtn />
                <GlobalModals />
            </div>
        </ModalProvider>
    );
}