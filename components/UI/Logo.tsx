import Image from "next/image";
import Link from "next/link";




export default function Logo() {
    return (
        <Link href={"/"} >
            <Image
                src={"/landing_page_assets/logo.png"}
                alt="logo"
                height={500} width={500}
                className=" w-12 md:w-18 "
            />
        </Link>
    )
}