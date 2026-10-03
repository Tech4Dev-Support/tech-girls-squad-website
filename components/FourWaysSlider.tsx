"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { ways_to_help_data } from '@/data/ways_to_help_data';
import HelpCard from './UI/HelpCard';

const Slider = () => {
    return (
        <>
            <Swiper
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }}
                spaceBetween={40}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="w-full h-full"
            >
                {ways_to_help_data.map((data, index) => (
                    <SwiperSlide key={index} className='h-auto! flex! ' >
                        <HelpCard data={data} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}





export default function FourWaysSlider() {
    return (
        <section className="w-full h-full  flex flex-col items-start justify-center py-3 px-1   " >
            <Slider />
        </section>
    )
}