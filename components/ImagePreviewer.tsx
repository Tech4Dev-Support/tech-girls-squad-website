import { Gallery_Image_Type } from "@/types/types"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import React, { useEffect } from "react"

interface ImagePreviewerProps {
    images: Gallery_Image_Type[]
    selectedImage: string
    setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>
    closeImage: () => void
}

export default function ImagePreviewer({
    images,
    selectedImage,
    setSelectedImage,
    closeImage,
}: ImagePreviewerProps) {
    const currentIndex = images.findIndex((img) => img.id === selectedImage)
    const selected_image_object = images[currentIndex]

    const goPrev = () => {
        const prev = (currentIndex - 1 + images.length) % images.length
        setSelectedImage(images[prev].id)
    }

    const goNext = () => {
        const next = (currentIndex + 1) % images.length
        setSelectedImage(images[next].id)
    }

    // Keyboard support: Esc to close, arrows to navigate
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeImage()
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === "ArrowRight") goNext()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    })

    // Don't render if the id doesn't match any image
    if (!selected_image_object) return null

    return (
        <div className="w-full h-[svh] md:h-screen fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between py-3 px-[2%] md:px-[5%]">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${selected_image_object.image_url})` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/90" />


            {/* main section */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between gap-10">
                    <div className="hidden md:block"></div>

                    <div className="w-fit border border-[#9E005C] rounded-[100px] py-2 px-5 flex items-center justify-center font-medium text-white text-sm md:text-base">
                        {currentIndex + 1}/{images.length}
                    </div>

                    <button
                        onClick={closeImage}
                        className="text-white  cursor-pointer size-12
                        flex items-center justify-center duration-200 ease-in-out transition-all hover:text-[#9E005D] "
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-between  ">
                    <button
                        onClick={goPrev}
                        className="text-white cursor-pointer size-13
                        hidden md:flex items-center justify-center duration-200 ease-in-out
                        transition-all hover:text-[#9E005D]"
                    >
                        <ChevronLeft size={38} />
                    </button>

                    <Image
                        src={selected_image_object.image_url}
                        alt={selected_image_object.category}
                        height={1000}
                        width={1000}
                        className=" w-[95%] mx-auto md:w-full max-w-214.25 object-cover object-center"
                    />

                    <button
                        onClick={goNext}
                        className="text-white cursor-pointer size-13 hidden md:flex
                         items-center justify-center duration-200 ease-in-out transition-all hover:text-[#9E005D]"
                    >
                        <ChevronRight size={38} />
                    </button>



                    <div className="w-fit flex md:hidden items-center justify-center gap-4 mt-7 " >
                        <button
                            onClick={goPrev}
                            className="text-white cursor-pointer size-13
                        flex items-center justify-center duration-200 ease-in-out
                        transition-all hover:text-[#9E005D]"
                        >
                            <ChevronLeft size={30} />
                        </button>

                        <button
                            onClick={goNext}
                            className="text-white cursor-pointer size-13 flex
                         items-center justify-center duration-200 ease-in-out transition-all hover:text-[#9E005D]"
                        >
                            <ChevronRight size={30} />
                        </button>

                    </div>
                </div>






                {/* Thumbnails */}
                <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto pb-2" >
                    <div className="w-fit flex items-center justify-between gap-2 h-fit">
                        {images.map((image) => (
                            <div
                                onClick={() => setSelectedImage(image.id)}
                                key={image.id}
                                className={`
                                   w-25 h-20   md:w-30 md:h-25 border-[3px] rounded-sm
                                cursor-pointer flex items-center justify-center overflow-hidden
                                ${selected_image_object.id === image.id ? "border-[#9E005D]" : "border-[#FFFFFF]"}
                            `}
                            >
                                <Image
                                    src={image.image_url}
                                    alt={image.category}
                                    height={500}
                                    width={500}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}