
"use client"

import { Gallery_Image_Type } from "@/types/types"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import React, { useCallback, useEffect, useRef, useState } from "react"

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
    const currentIndex = images.findIndex(
        (img) => img.id === selectedImage
    )

    const selected_image_object = images[currentIndex]

    const [imageLoaded, setImageLoaded] = useState(false)

    const goPrev = useCallback(() => {
        if (!images.length) return

        const prev = (currentIndex - 1 + images.length) % images.length
        setSelectedImage(images[prev].id)
    }, [currentIndex, images, setSelectedImage])

    const goNext = useCallback(() => {
        if (!images.length) return

        const next = (currentIndex + 1) % images.length
        setSelectedImage(images[next].id)
    }, [currentIndex, images, setSelectedImage])

    // Reset loader whenever the selected image changes
    useEffect(() => {
        setImageLoaded(false)
    }, [selectedImage])

    // Preload previous and next images
    useEffect(() => {
        if (!images.length || currentIndex === -1) return

        const prevIndex =
            (currentIndex - 1 + images.length) % images.length

        const nextIndex =
            (currentIndex + 1) % images.length

        const preloadImage = (src: string) => {
            const img = new window.Image()
            img.src = src
        }

        preloadImage(images[prevIndex].image_url)
        preloadImage(images[nextIndex].image_url)

    }, [currentIndex, images])

    // Keyboard support
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeImage()
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === "ArrowRight") goNext()
        }

        window.addEventListener("keydown", onKey)

        return () => window.removeEventListener("keydown", onKey)
    }, [closeImage, goPrev, goNext])






    // handling swipe for mobile devices

    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) return

        const touchEndX = e.changedTouches[0].clientX
        const touchEndY = e.changedTouches[0].clientY

        const diffX = touchStartX.current - touchEndX
        const diffY = touchStartY.current - touchEndY

        // Only navigate when the horizontal swipe is dominant
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                goNext()
            } else {
                goPrev()
            }
        }

        touchStartX.current = null
        touchStartY.current = null
    }






    if (!selected_image_object) return null

    return (
        <div className="w-full h-dvh fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between py-3 px-[2%] md:px-[5%]">

            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{
                    backgroundImage: `url(${selected_image_object.image_url})`
                }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/90" />

            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative z-10 w-full h-full min-h-0 flex flex-col items-center justify-between touch-pan-y">

                {/* Header */}
                <div className="w-full flex items-center justify-between gap-10">
                    <div className="block w-12" />

                    <div className="w-fit mx-auto border border-[#9E005C] rounded-[100px] py-2 px-5 flex items-center justify-center font-medium text-white text-sm md:text-base">
                        {currentIndex + 1}/{images.length}
                    </div>

                    <button
                        onClick={closeImage}
                        className="text-white cursor-pointer size-12 flex items-center justify-center duration-200 transition-all hover:text-[#9E005D]"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main image */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between">

                    <button
                        onClick={goPrev}
                        className="text-white cursor-pointer size-13 hidden md:flex items-center justify-center hover:text-[#9E005D]"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="relative w-full max-w-97.5 h-73 md:max-w-214.25 md:h-112.5 mx-auto overflow-hidden flex items-center justify-center">

                        {/* Skeleton */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-md">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white/80 animate-spin" />
                                </div>
                            </div>
                        )}

                        <Image
                            key={selected_image_object.id}
                            src={selected_image_object.image_url}
                            alt={selected_image_object.category}
                            fill
                            sizes="(max-width: 768px) 100vw, 850px"
                            priority
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)}
                            className={`
                                object-cover object-center
                                transition-opacity duration-500 ease-in-out
                                ${imageLoaded ? "opacity-100" : "opacity-0"}
                            `}
                        />
                    </div>

                    <button
                        onClick={goNext}
                        className="text-white cursor-pointer size-13 hidden md:flex items-center justify-center hover:text-[#9E005D]"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="w-full flex items-center justify-start overflow-x-auto hide-scrollbar pb-5 md:pb-2">
                    <div className="w-fit flex items-center justify-between gap-1 h-fit">
                        {images.map((image) => (
                            <div
                                onClick={() => setSelectedImage(image.id)}
                                key={image.id}
                                className={`
                                    w-25 h-20 md:w-30 md:h-25
                                    border-[3px] rounded-sm cursor-pointer
                                    flex items-center justify-center overflow-hidden
                                    ${selected_image_object.id === image.id
                                        ? "border-[#9E005D]"
                                        : "border-[#FFFFFF]"
                                    }
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
