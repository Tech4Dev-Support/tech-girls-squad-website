

import CustomButton from "@/components/UI/CustomButton";
import Image from "next/image";
import Link from "next/link";




export default function Page() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-3 md:p-16 ">

            <div className="w-full h-full max-w-65 md:max-w-169.5  " >
                <Image
                    src={"/order.png"}
                    alt="order"
                    width={1000}
                    height={1000}
                    className=" w-full object-center object-cover "
                    priority
                />
            </div>

            <div className=" w-full md:max-w-149.5 flex flex-col items-center md:items-start gap-5 md:gap-6 text-center md:text-start " >
                <h2 className="text-dark text-[28px] md:text-[56px] font-fredoka font-bold leading-[110%] " >
                    Thank you for your order.
                </h2>

                <p className="text-dark font-manrope font-normal text-[15px] md:text-lg " >
                    We've sent a confirmation to <span className="text-primary" >ebiuwa@gmail.com.</span>
                </p>


                <div className="w-full bg-section rounded-xl flex flex-col py-2 px-5 gap-1 " >

                    <div className="w-full flex items-center justify-between  py-3  " >
                        <h5 className=" text-sm md:text-lg text-dark font-normal  " >Order number</h5>
                        <h4 className=" text-sm md:text-lg text-dark font-semibold">TGS-260929-4821</h4>
                    </div>

                    <div className="w-full flex items-center justify-between border-b border-t border-[#00000014] py-3 " >
                        <h5 className=" text-sm md:text-lg text-dark font-normal  ">Copies</h5>
                        <h4 className=" text-sm md:text-lg text-dark font-semibold">2</h4>
                    </div>


                    <div className="w-full flex items-center justify-between  py-3" >
                        <h5 className=" text-sm md:text-lg text-dark font-normal  ">Delivery</h5>
                        <h4 className=" text-sm md:text-lg text-dark font-semibold">Within 3 working days</h4>
                    </div>

                </div>


                <Link href={"/"} className="w-full! md:w-fit!" >
                    <CustomButton className="w-full! md:w-fit!  text-lg!" >
                        Back to Tech Girls Squad
                    </CustomButton>
                </Link>

                <p className="text-dark font-manrope font-normal text-[13px] md:text-base " >
                    Need help?  <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={"mailto:techgirlssquad@tech4dev.com"}
                        className="text-primary" >techgirlssquad@tech4dev.com</Link></p>
            </div>

        </main>
    );
}