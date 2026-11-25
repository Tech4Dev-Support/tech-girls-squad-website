import Image from "next/image";
import Link from "next/link";




export default function Logo() {
    return (
        <Link href={"/"} >
            <Image
                src={"/landing_page_assets/logo.png"}
                alt="logo"
                height={500} width={500}
                className=" w-[50.82px] md:w-18 z-20 "
            />
        </Link>
    )
}