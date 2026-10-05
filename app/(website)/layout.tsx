import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";





export default function WebsiteLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-full flex flex-col relative ">
            <Navbar />
            {children}
            <Footer />
            <ScrollToTopBtn />
        </div>
    );
}