

import CustomButton from "@/components/UI/CustomButton";
import Image from "next/image";
import Link from "next/link";




export default function Page() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-4 md:p-16 ">

            <div className="w-full h-full md:max-w-169.5  " >
                <Image
                    src={"/payment-failed.png"}
                    alt="order"
                    width={1000}
                    height={1000}
                    className=" w-full object-center object-cover "
                />
            </div>

            <div className=" w-full md:max-w-149.5 flex flex-col items-start gap-5 md:gap-8 " >
                <h2 className="text-dark text-4xl md:text-7xl font-fredoka font-bold leading-[110%] " >
                    That payment didn't go through.
                </h2>

                <p className="text-dark font-manrope font-normal text-base md:text-lg " >
                    No money has left your account. Please try again, or contact us at
                    <span className="text-primary " >techgirlssquad@tech4dev.com </span> if the problem continues.</p>


                <div className="flex items-center justify-start gap-4 " >

                    <Link href={"/"} >
                        <CustomButton>
                            Try Again
                        </CustomButton>
                    </Link>

                    <Link href={"/"}  >
                        <CustomButton
                            className="border-dark! text-dark!"
                            variant="outline" >
                            Back to Tech Girls Squad
                        </CustomButton>
                    </Link>
                </div>
            </div>

        </main >
    );
}