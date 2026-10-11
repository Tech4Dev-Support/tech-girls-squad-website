"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  className?: string;
}

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-8 sm:mb-10 ${className}`}>
      <div>
        <h2 className="font-fredoka text-2xl sm:text-3xl max-w-sm font-semibold text-[#000000] leading-tight">
          {title}
        </h2> 
        {subtitle && (
          <p className="font-manrope lg:max-w-[450px] text-xs sm:text-lg text-[#333333] mt-2">
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        type="button"
        aria-label="Close modal"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F5E6EF] hover:bg-[#F5E6EF] text-[#353535] flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
      >
        <X color="#353535" className="w-5 h-5 stroke-[1.5]" />
      </button>
    </div>
  );
}
