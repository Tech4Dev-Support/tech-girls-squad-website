import { bring_it_to_life_data } from "@/data/bring_it_to_life_data";
import BringItToLifeCard from "./UI/BringItToLifeCard";


export default function BringItToLife() {
    return (
        <section className="bg-section px-4 md:px-16 pt-12 pb-20 flex flex-col items-center gap-8 "  >

            <h2 className="font-fredoka text-3xl md:text-4xl lg:text-[44px] font-bold text-dark leading-[1.18]">
                How We Bring it to Life
            </h2>


            <div className=" mt-3 grid grid-cols-1 md:grid-cols-3 place-items-center justify-items-center gap-9.5 "  >
                {bring_it_to_life_data.map((data, i) => (
                    <BringItToLifeCard key={i} data={data} />
                ))}
            </div>

        </section>
    )
}