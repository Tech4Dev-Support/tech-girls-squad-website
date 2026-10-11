"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../UI/CustomButton";

interface FormWrapperProps {
  formName: string;
  onSubmit: (formData: Record<string, any>) => Promise<boolean> | boolean;
  children: React.ReactNode;
  submitButtonText?: string;
  isSubmitDisabled?: boolean;
  className?: string;
  redirectTo?: string;
}

export default function FormWrapper({
  formName,
  onSubmit,
  children,
  submitButtonText = "Proceed to Payment",
  isSubmitDisabled = false,
  className = "",
  redirectTo,
}: FormWrapperProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const formValues: Record<string, any> = {};

    formData.forEach((val, key) => {
      formValues[key] = val;
    });

    setIsSubmitting(true);

    try {
      const isValid = await onSubmit(formValues);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }
     
      const body = new URLSearchParams(formData as any).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (response.ok) {
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }
        setIsSuccess(true);
      } else {
        throw new Error("Form submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Something went wrong. Please try again or reach us at techgirlssquad@tech4dev.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 px-4 text-center font-manrope space-y-4">
        <div className="w-14 h-14 bg-[#F9EAF2] text-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          ✓
        </div>
        <h3 className="font-fredoka text-2xl font-bold text-dark">Thank you!</h3>
        <p className="text-sm text-foreground">
          Your request has been submitted successfully. We have sent details to your email.
        </p>
      </div>
    );
  }

  return (
    <form
      name={formName}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={`space-y-4 font-manrope ${className}`}
    >
      <input type="hidden" name="form-name" value={formName} />
      <p className="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      {children}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-manrope">
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
