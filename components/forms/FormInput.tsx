"use client";

import React, { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, error, disabled, readOnly, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="w-full flex flex-col">
        <label
          htmlFor={inputId}
          className="font-manrope text-xs sm:text-base font-medium text-dark flex items-center gap-0.5 mb-1.5"
        >
          {label}
          {required && <span className="text-[#E53E3E] ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full border rounded-[8px] px-3.5 py-2.5 sm:py-3 font-manrope text-sm sm:text-base text-dark placeholder:text-[#A0AEC0] placeholder:font-normal outline-none transition-all ${
            readOnly || disabled
              ? "bg-[#FAFAFA] border-[#D2D8E8] text-[#333333] cursor-not-allowed"
              // : error 
              // ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white" 
              : "border-[#D2D8E8] focus:border-[#9E005D] focus:ring-1 focus:ring-[#9E005D] bg-white"  
          } ${className}`}  
          {...props}  
        />
        {error && <span className="font-sans text-xs text-[#FF0000] mt-[8px] ">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
