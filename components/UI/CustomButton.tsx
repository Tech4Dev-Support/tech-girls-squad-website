
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    onClick?: () => void;
    className?: string;
}

export default function CustomButton({
    children,
    variant = "primary",
    onClick,
    className = "",
}: ButtonProps) {
    const baseStyles =
        "font-manrope inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm md:text-base font-semibold transition-all duration-200 cursor-pointer ";

    const variants = {
        primary:
            "bg-primary text-primary-foreground hover:bg-[#700042] ",

        outline:
            "border border-white bg-transparent text-white ",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}  `}
        >
            <span className="flex items-center gap-2.5 "  >{children}</span>

        </button>
    );
}