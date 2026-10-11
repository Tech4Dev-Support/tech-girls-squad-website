"use client";

import React from "react";

interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export default function FormToggle({ label, checked, onChange, id }: FormToggleProps) {
  const toggleId = id || `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full flex items-center justify-between py-2 ">
      <label htmlFor={toggleId} className="font-manrope font-medium text-dark text-sm sm:text-base cursor-pointer">
        {label}
      </label>

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  ${
          checked ? "bg-[#9E005D]" : "bg-[#CBD5E0]"
        }`}
      > 
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
