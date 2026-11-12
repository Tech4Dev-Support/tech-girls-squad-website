"use client"


import { gallery_images } from "@/data/gallery_images";
import { Gallery_Image_Type } from "@/types/types";
import Image from "next/image";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";



export default function GallerySection() {

    const [category, setCategory] = useState<Gallery_Image_Type["category"]>("Advocacy Visits")
    const galleryRef = useRef<HTMLDivElement>(null);


    // The filtered images based on category
    const images = gallery_images.filter((img) =>
        img.category === category
    )



    // This function handles animation on category change
    const handleCategoryChange = (newCategory: Gallery_Image_Type["category"]) => {
        if (newCategory === category) return;

        gsap.to(galleryRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
                setCategory(newCategory);
            }
        });
    };



    // the animation is called when the category value changes
    useEffect(() => {
        gsap.to(galleryRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
        });
    }, [category]);


    return (
        <section className="px-4 md:px-16 py-20 flex flex-col items-center gap-10 ">

            {/* Heading */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 " >
                <div className="space-y-4 max-w-186.5 " >
                    <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                        A little look at our journey
                    </h2>

                    <p className="font-manrope text-foreground text-base md:text-lg leading-relaxed">
                        Special moments that capture the work, milestones and progress behind our journey.
                    </p>
                </div>


                <div className=" mr-auto md:mr-0 w-fit bg-dark-gray flex gap-1 md:gap-2.5 items-center justify-between p-1.5 md:p-2 rounded-[28px] " >
                    <button
                        onClick={() => handleCategoryChange("Advocacy Visits")}
                        className={`
                        py-2  px-4 md:px-6 rounded-3xl flex items-center justify-center  font-semibold text-sm md:text-base cursor-pointer
                        duration-300 ease-in-out transition-all
${category === "Advocacy Visits" ? "bg-beige text-dark " : "text-beige bg-transparent"}

                        `} >
                        Advocacy Visits
                    </button>


                    <button
                        onClick={() => handleCategoryChange("Book Launch")}
                        className={`
                        py-2  px-4 md:px-6 rounded-3xl flex items-center justify-center  font-semibold text-sm md:text-base cursor-pointer
                        duration-300 ease-in-out transition-all
                        ${category === "Book Launch" ? "bg-beige text-dark " : "text-beige bg-transparent"}
                        `}>
                        Book Launch
                    </button>
                </div>
            </div>




            {/* Images  */}

            <div
                ref={galleryRef}
                className="w-full min-h-151.5 xl:min-h-175 grid grid-cols-4 grid-rows-6 md:grid-rows-5 gap-1.5 md:gap-2.5  " >


                {/* 1st card  */}
                <div className="w-full bg-gray-50 h-full col-span-2 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[0].image_url}
                        alt={images[0].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out " />
                </div>


                {/* 2nd card */}
                <div className="w-full bg-gray-50 h-full col-span-2 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group ">
                    <Image
                        src={images[1].image_url}
                        alt={images[1].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>



                {/* 5th and 6th card */}
                <div className="w-full bg-gray-50 h-full col-span-2 md:col-span-1 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[4].image_url}
                        alt={images[4].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>



                <div className="w-full bg-gray-50 h-full col-span-2 md:col-span-1 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >

                    <Image
                        src={images[5].image_url}
                        alt={images[5].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />

                </div>



                {/* 3rd and 4th card */}
                <div className="w-full bg-gray-50 h-full col-span-2 md:col-span-1 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[2].image_url}
                        alt={images[2].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>

                <div className="w-full bg-gray-50 h-full col-span-2 md:col-span-1 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group ">
                    <Image
                        src={images[3].image_url}
                        alt={images[3].category}
                        fill
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>

            </div>


        </section>
    )
}