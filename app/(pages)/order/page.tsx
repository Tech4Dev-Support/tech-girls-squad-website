

import CustomButton from "@/components/UI/CustomButton";
import Image from "next/image";
import Link from "next/link";




export default function Page() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-4 md:p-16 ">

            <div className="w-full h-full md:max-w-169.5  " >
                <Image
                    src={"/order.png"}
                    alt="order"
                    width={1000}
                    height={1000}
                    className=" w-full object-center object-cover "
                />
            </div>

            <div className=" w-full md:max-w-149.5 flex flex-col items-start gap-5 md:gap-8 " >
                <h2 className="text-dark text-4xl md:text-7xl font-fredoka font-bold leading-[110%] " >
                    Thank you for your order.
                </h2>

                <p className="text-dark font-manrope font-normal text-base md:text-lg " >
                    Your order reference is <span className="text-primary" >TGS-260929-4821</span>, and we've sent a
                    confirmation to <span className="text-primary" >ebiuwa@gmail.com.</span></p>

                <p className="text-dark font-manrope font-normal text-base md:text-lg " >
                    Your 2 copies will be dispatched within <span className="text-primary" >3 working days.</span></p>


                <p className="text-dark font-manrope font-normal text-base md:text-lg " >
                    If anything looks wrong, reply to that email or
                    reach us at <span className="text-primary" >techgirlssquad@tech4dev.com.</span></p>




                <Link href={"/"} >
                    <CustomButton>
                        Back to Tech Girls Squad
                    </CustomButton>
                </Link>
            </div>

        </main>
    );
}