"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FormSelectProps {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
}

export default function FormSelect({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = "Select option",
  disabled = false,
  error,
  id,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col relative">
      <label
        htmlFor={selectId}
        className="font-manrope text-xs sm:text-sm font-medium text-dark flex items-center gap-0.5 mb-1.5"
      >
        {label}
        {required && <span className="text-[#E53E3E] ml-0.5">*</span>}
      </label>

      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full border rounded-xl px-3.5 py-2.5 sm:py-3 font-manrope text-sm sm:text-base flex items-center justify-between transition-all text-left ${
          disabled
            ? "bg-[#F8F9FA] border-[#E2E8F0] text-[#A0AEC0] cursor-not-allowed"
            : isOpen
            ? "border-[#BE5492] ring-1 ring-[#BE5492] bg-white"
            : error
            ? "border-red-500 bg-white"
            : "border-[#E2E8F0] hover:border-[#BE5492] bg-white"
        }`}
      >
        <span className={value ? "text-dark font-medium" : "text-[#A0AEC0] font-normal"}>
          {value || placeholder}
        </span>
        {isOpen ? (
          <ChevronUp  className="text-[#A5A5A5] shrink-0" />
        ) : (
          <ChevronDown  className="text-[#A5A5A5] shrink-0" />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 max-h-52 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden divide-y divide-[#F0F4F8]">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[#A0AEC0] font-manrope">No options available</div>
          ) : (
            options.map((option, index) => {
              const isSelected = value === option;
              return (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-3 text-sm font-manrope cursor-pointer transition-colors ${
                    index === 0 ? "rounded-t-xl" : ""
                  } ${
                    index === options.length - 1 ? "rounded-b-xl" : ""
                  } ${
                    isSelected
                      ? "bg-[#F5E6F0] font-medium text-dark"
                      : "text-dark hover:bg-[#F9F0F6]"
                  }`}
                >
                  {option}
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <span className="font-manrope text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
