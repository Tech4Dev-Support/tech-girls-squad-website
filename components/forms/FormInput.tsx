"use client";

import React, { forwardRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  onStep?: (delta: number) => void;
  disableDecrement?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      required,
      error,
      disabled,
      readOnly,
      className = "",
      id,
      onStep,
      disableDecrement = false,
      type,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasStepper = typeof onStep === "function" && !disabled && !readOnly;

    return (
      <div className="w-full flex flex-col">
        <label
          htmlFor={inputId}
          className="font-manrope text-xs sm:text-base font-medium text-dark flex items-center gap-0.5 mb-1.5"
        >
          {label}
          {required && <span className="text-[#E53E3E] ml-0.5">*</span>}
        </label>
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full border rounded-[8px] px-3.5 py-2.5 sm:py-3 font-manrope text-sm sm:text-base text-dark placeholder:text-[#A0AEC0] placeholder:font-normal outline-none transition-all ${
              hasStepper
                ? "pr-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                : ""
            } ${
              readOnly || disabled
                ? "bg-[#FAFAFA] border-[#D2D8E8] text-[#333333] cursor-not-allowed"
                : "border-[#D2D8E8] focus:border-[#9E005D] focus:ring-1 focus:ring-[#9E005D] bg-white"
            } ${className}`}
            {...props}
          />
          {hasStepper && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <button
                type="button"
                aria-label={`Increase ${label}`}
                onClick={() => onStep(1)}
                className="p-0.5 text-[#718096] hover:text-primary active:text-primary cursor-pointer transition-colors"
              >
                <ChevronUp className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                aria-label={`Decrease ${label}`}
                disabled={disableDecrement}
                onClick={() => onStep(-1)}
                className={`p-0.5 transition-colors ${
                  disableDecrement
                    ? "text-[#CBD5E0] cursor-not-allowed"
                    : "text-[#718096] hover:text-primary active:text-primary cursor-pointer"
                }`}
              >
                <ChevronDown className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
        {error && (
          <span className="font-sans text-xs text-[#FF0000] mt-[8px] ">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
