"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface EnquirySuccessCardProps {
  title: string;
  subtitle: string;
  onClose: () => void;
}

export default function EnquirySuccessCard({
  title,
  subtitle,
  onClose,
}: EnquirySuccessCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 sm:gap-5">
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#9E005D] bg-white flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#333333] stroke-[2.2]" />
        </div>

        <div className="min-w-0">
          <h2 className="font-fredoka text-xl sm:text-[26px] font-bold text-dark leading-tight">
            {title}
          </h2>
          <p className="font-manrope text-xs sm:text-base text-[#4A5568] mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        type="button"
        aria-label="Close modal"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F9EAF2] hover:bg-[#F3D7E7] text-[#333333] flex items-center justify-center transition-colors cursor-pointer shrink-0 self-start"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
      </button>
    </div>
  );
}
