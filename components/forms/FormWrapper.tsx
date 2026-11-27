"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ApiSubmitResult } from "@/lib/api";

interface FormWrapperProps {
  onSubmit: (honeypotValue: string) => Promise<ApiSubmitResult | false> | ApiSubmitResult | false;
  children: React.ReactNode;
  submitButtonText?: string;
  isSubmitDisabled?: boolean;
  className?: string;
  showHoneypot?: boolean;
  successTitle?: string;
  successMessage?: string;
}

export default function FormWrapper({
  onSubmit,
  children,
  submitButtonText = "Proceed to Payment",
  isSubmitDisabled = false,
  className = "",
  showHoneypot = false,
  successTitle = "Thank you!",
  successMessage = "Your request has been submitted successfully. We have sent details to your email.",
}: FormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const redirectedRef = useRef(false);

  // Reset submitting state if user navigates back from Paystack (bfcache or tab return)
  useEffect(() => {
    const resetSubmitting = () => {
      if (redirectedRef.current) {
        redirectedRef.current = false;
        setIsSubmitting(false);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || redirectedRef.current) {
        redirectedRef.current = false;
        setIsSubmitting(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetSubmitting();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await onSubmit(honeypot);

      if (result === false) {
        setIsSubmitting(false);
        return;
      }

      if (!result.ok) {
        setErrorMessage(
          result.error ||
            "Something went wrong. Please try again or reach us at techgirlssquad@tech4dev.com"
        );
        setIsSubmitting(false);
        return;
      }

      if (result.redirectUrl) {
        redirectedRef.current = true;
        window.location.assign(result.redirectUrl);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        "Something went wrong. Please try again or reach us at techgirlssquad@tech4dev.com"
      );
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 px-4 text-center font-manrope space-y-4">
        <div className="w-14 h-14 bg-[#F9EAF2] text-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h3 className="font-fredoka text-2xl font-bold text-dark">{successTitle}</h3>
        <p className="text-sm text-foreground">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-4 font-manrope ${className}`}
    >
      {showHoneypot && (
        <div className="hidden" aria-hidden="true">
          <label htmlFor="honeypot">
            Leave this field empty
            <input
              id="honeypot"
              name="honeypot"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>
      )}

      {children}

      {errorMessage && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-manrope"
        >
          {errorMessage}
        </div>
      )}

      <div className="pt-5">
        <button
          type="submit"
          disabled={isSubmitDisabled || isSubmitting}
          className={`w-full py-3 px-6 rounded-full font-manrope font-semibold text-sm sm:text-base text-white transition-all duration-200 shadow-sm ${
            isSubmitDisabled || isSubmitting
              ? "bg-[#D890B9] opacity-90 cursor-not-allowed"
              : "bg-[#9E005D] hover:bg-[#700042] cursor-pointer"
          }`}
        >
          {isSubmitting ? "Processing..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
