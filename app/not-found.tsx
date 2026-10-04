import CustomButton from "@/components/UI/CustomButton";
import Image from "next/image";
import Link from "next/link";




export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col md:flex-row gap-9 items-center justify-center py-8 px-4 md:p-16 ">

            <div className="w-full h-full md:max-w-169.5  " >
                <Image
                    src={"/not-found-image.png"}
                    alt="not-found-image"
                    width={1000}
                    height={1000}
                    className=" w-full object-center object-cover "
                />
            </div>

            <div className=" w-full md:max-w-149.5 flex flex-col items-start gap-5 md:ap-8 " >
                <h2 className="text-dark text-4xl md:text-7xl font-fredoka font-bold leading-[110%] " >Sorry, we couldn't find that page.</h2>

                <p className="text-dark font-manrope font-normal text-base md:text-lg " >
                    The link may be broken, or the page may have moved. Let's get you back to the story.</p>

                <Link href={"/"} >
                    <CustomButton>
                        Back to Tech Girls Squad
                    </CustomButton>
                </Link>
            </div>

        </main>
    );
}