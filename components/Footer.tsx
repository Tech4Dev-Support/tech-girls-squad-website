import { footer_explore_data, footer_get_involved_data } from "@/data/footer_data";
import Logo from "./UI/Logo";
import Link from "next/link";




export default function Footer() {
    return (
        <footer className="bg-dark px-3.25 pt-20 pb-10 flex  flex-col items-center justify-center gap-10  " >

            {/* top section  */}
            <div className=" px-4 md:px-16 flex flex-col md:flex-row items-start justify-between gap-14 md:gap-28 w-full  " >

                <div className="w-full max-w-88  flex flex-col items-start gap-8  " >
                    <Logo />

                    <div className="space-y-6" >
                        <p className=" text-base md:text-lg font-manrope text-background font-normal " >
                            An advocacy book by Tech4Dev, delivered through Women Techsters.</p>

                        <div className=" w-fit flex items-center gap-2 " >

                        </div>
                    </div>
                </div>



                <div className="w-full max-w-21.25 flex flex-col items-start gap-8  ">
                    <h3 className="text-base font-bold text-background font-fredoka "  >Explore</h3>

                    <div className="w-full flex flex-col items-start gap-4 md:gap-6  ">
                        {footer_explore_data.map((data, i) => (
                            <Link
                                className="text-sm md:text-base font-semibold text-background font-manrope hover:text-primary duration-200 ease-in-out transition-all "
                                key={i}
                                href={data.path} >
                                {data.label}
                            </Link>
                        ))}
                    </div>
                </div>



                <div className="w-full max-w-33.75 flex flex-col items-start gap-8  ">
                    <h3 className="text-base font-bold text-background font-fredoka "  >Get Involved</h3>

                    <div className="w-full flex flex-col items-start gap-4 md:gap-6  ">
                        {footer_get_involved_data.map((data, i) => (
                            <Link
                                className="text-sm md:text-base font-semibold text-background font-manrope hover:text-primary duration-200 ease-in-out transition-all "
                                key={i}
                                href={data.path} >
                                {data.label}
                            </Link>
                        ))}
                    </div>
                </div>




                <div className="w-full max-w-81.25 flex flex-col items-start gap-8  ">
                    <h3 className="text-base font-bold text-background font-fredoka "  >Connect</h3>

                    <div className="w-full flex flex-col items-start gap-4 md:gap-6 font-manrope text-sm md:text-base text-background font-semibold  ">
                        <p>7, Omo Ighodalo Street, Ogudu GRA,
                            Ogudu, Lagos, Nigeria</p>

                        <p>No 9, Tema Street, Wuse Zone 6, Abuja,
                            Nigeria</p>

                        <p>110 W Randol Mill Road State 240 Arlington
                            Texas 76011, USA</p>

                        <p>enquiries@tech4dev.com</p>


                        <p>+234 913 315 1674</p>
                    </div>
                </div>



            </div>



            {/* bottom section  */}
            <div className=" w-full flex flex-col md:flex-row md:items-center justify-between
              border-t-[0.5px] border-[#A5A5A5] pt-8 gap-5.5 md:gap-12.5 px-3.25
               " >

                <h6 className=" text-sm md:text-base font-normal text-[#A5A5A5]  " >Expanding possibilities for African girls.</h6>


                <h6 className=" text-sm md:text-base font-normal text-[#A5A5A5]  ">
                    Copyright © Technology for Social Change and Development Initiative
                    {" "}
                    {new Date().getFullYear()}
                </h6>


                <div className="w-fit flex flex-col md:flex-row md:items-center gap-2.5 "  >

                    <Link href={"#"} className=" text-sm md:text-base font-normal text-[#A5A5A5] hover:text-primary duration-200 ease-in-out transition-all  "  >
                        Privacy Policy .
                    </Link>

                    <Link href={"#"} className=" text-sm md:text-base font-normal text-[#A5A5A5] hover:text-primary duration-200 ease-in-out transition-all  " >
                        Terms of Use .
                    </Link>

                    <Link href={"#"} className=" text-sm md:text-base font-normal text-[#A5A5A5] hover:text-primary duration-200 ease-in-out transition-all " >
                        Refund & Delivery Policy
                    </Link>

                </div>


            </div>

        </footer>
    )
}