"use client"


import { gallery_images } from "@/data/gallery_images";
import { Gallery_Image_Type } from "@/types/types";
import Image from "next/image";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import ImagePreviewer from "./ImagePreviewer";



export default function GallerySection() {

    const [category, setCategory] = useState<Gallery_Image_Type["category"]>("Advocacy Visits")
    const galleryRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [showImage, setShowImage] = useState(false)


    // The filtered images based on category
    const images = gallery_images.filter((img) =>
        img.category === category
    )



    // This function handles animation on category change
    const handleCategoryChange = (newCategory: Gallery_Image_Type["category"]) => {
        if (newCategory === category) return;

        gsap.to(galleryRef.current, {
            opacity: 0,
            duration: 0.2,
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
            duration: 0.2,
            ease: "power2.out",
        });
    }, [category]);




    // Disable scrolling when an image is being viewed
    useEffect(() => {
        if (!showImage) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [showImage])




    return (
        <section
            id="gallery"
            className="scroll-mt-20 px-6 md:px-10 py-10 md:py-20 flex flex-col items-center gap-6 md:gap-10 ">

            {/* Heading */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 " >
                <div className="space-y-4 max-w-186.5 " >
                    <h2 className="font-fredoka text-2xl md:text-4xl  font-bold text-foreground leading-[1.18]">
                        A little look at our journey
                    </h2>

                    <p className="font-manrope text-[#646464] text-base md:text-lg leading-relaxed">
                        Special moments that capture the work, milestones and progress behind our journey.
                    </p>
                </div>


                <div className=" mr-auto md:mr-0 w-full md:w-fit
                 bg-section
                flex gap-1 md:gap-2.5
                 items-center justify-between
                  p-2 rounded-[28px] " >
                    <button
                        onClick={() => handleCategoryChange("Advocacy Visits")}
                        className={`
                        py-2  px-4 md:px-6 rounded-3xl flex items-center justify-center  font-semibold text-base cursor-pointer
                        duration-20 ease-in-out transition-all
${category === "Advocacy Visits" ? "bg-background text-dark shadow-[0px_1px_3px_0px_#00000014] " : "text-foreground bg-transparent "}

                        `} >
                        Advocacy Visits
                    </button>


                    <button
                        onClick={() => handleCategoryChange("Book Launch")}
                        className={`
                        py-2  px-4 md:px-6 rounded-3xl flex items-center justify-center  font-semibold text-base cursor-pointer
                        duration-200 ease-in-out transition-all
                        ${category === "Book Launch" ? "bg-background text-dark shadow-[0px_1px_3px_0px_#00000014] " : "text-foreground bg-transparent"}
                        `}>
                        Book Launch
                    </button>
                </div>
            </div>




            {/* Images  */}

            <div
                ref={galleryRef}
                className="w-full min-h-151.5 xl:min-h-175 grid grid-cols-1 md:grid-cols-4 grid-rows-12 md:grid-rows-5 gap-1.5 md:gap-2.5  " >


                {/* 1st card  */}
                <div
                    onClick={() => {
                        setSelectedImage(images[0].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[0].image_url}
                        alt={images[0].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out " />
                </div>


                {/* 2nd card */}
                <div
                    onClick={() => {
                        setSelectedImage(images[1].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group ">
                    <Image
                        src={images[1].image_url}
                        alt={images[1].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>



                {/* 5th and 6th card */}
                <div
                    onClick={() => {
                        setSelectedImage(images[4].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 md:col-span-1 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[4].image_url}
                        alt={images[4].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>



                <div
                    onClick={() => {
                        setSelectedImage(images[5].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 md:col-span-1 row-span-2 md:row-span-3 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >

                    <Image
                        src={images[5].image_url}
                        alt={images[5].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />

                </div>



                {/* 3rd and 4th card */}
                <div
                    onClick={() => {
                        setSelectedImage(images[2].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 md:col-span-1 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group " >
                    <Image
                        src={images[2].image_url}
                        alt={images[2].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>

                <div
                    onClick={() => {
                        setSelectedImage(images[3].id)
                        setShowImage(true)
                    }}
                    className="w-full bg-gray-50 h-50 md:h-full col-span-2 md:col-span-1 row-span-2 rounded-lg md:rounded-2xl relative overflow-hidden  cursor-pointer group ">
                    <Image
                        src={images[3].image_url}
                        alt={images[3].category}
                        fill
                        priority
                        className="object-cover object-center group-hover:scale-110 duration-400 ease-in-out" />
                </div>

            </div>



            {showImage && selectedImage !== null && (
                <ImagePreviewer
                    setSelectedImage={setSelectedImage}
                    selectedImage={selectedImage}
                    images={images}
                    closeImage={() => setShowImage(false)}
                />
            )}

        </section>
    )
}