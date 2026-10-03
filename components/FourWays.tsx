import FourWaysSlider from "./FourWaysSlider";



export default function FourWays() {
    return (
        <section className="bg-section px-4 md:px-16 py-20 flex flex-col items-start gap-4 " >
            <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                Four ways to help more girls discover what's possible
            </h2>

            <p className=" font-manrope text-foreground text-base md:text-lg leading-relaxed max-w-250 ">
                Every girl deserves the opportunity to discover what's possible through STEM.
                Whether you are supporting a school, funding future volumes,
                or partnering with us, your contribution helps more girls access stories
                that inspire curiosity, confidence, and new possibilities.
            </p>



            <div className="w-full mx-auto h-full overflow-hidden  mt-7 " >
                <FourWaysSlider />
            </div>




        </section>
    )
}