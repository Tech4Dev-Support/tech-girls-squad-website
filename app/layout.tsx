import type { Metadata } from "next";
import { Fredoka, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";


const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"]
})


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Tech Girls Squad | STEM Stories for African Girls",
  description: "An advocacy book by Tech4Dev introducing girls across Africa to STEM through stories that build confidence and spark curiosity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` ${fredoka.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative ">
        <Navbar />
        {children}</body>
    </html>
  );
}
