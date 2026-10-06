import { stories_data } from "@/data/stories_data";
import StoryCard from "./UI/StoryCard";


export default function Stories() {
    return (
        <section
            id="the_books"
            className=" px-4 md:px-16 py-20 flex flex-col items-start gap-4  " >

            <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                Stories that spark curiosity and inspire possibility.
            </h2>

            <p className=" font-manrope text-foreground text-base md:text-lg leading-relaxed">
                Every Girl Deserves the Chance to Imagine a Different Future.
            </p>



            <div className="w-full grid grid-cols-1 place-items-center justify-center gap-12 mt-10  "  >

                {stories_data.map((story, i) => (
                    <StoryCard
                        key={i}
                        data={story}
                        index={i}
                    />
                ))}

            </div>


        </section>
    )
}