"use client";

import React, { useEffect, useRef } from "react";
import ModalHeader from "./ModalHeader";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
}: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40  animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-[600px] bg-white rounded-[28px] p-6 sm:px-10 sm:py-15 shadow-2xl text-dark font-manrope my-auto max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all ${className}`}
      >
         {title && (
          <ModalHeader
            title={title}
            subtitle={subtitle}
            onClose={onClose}
          />
        )}

        {children}
      </div>
    </div>
  );
}
// backdrop-blur-xs
