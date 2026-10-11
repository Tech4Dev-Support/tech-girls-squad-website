"use client";

import React, { useState } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import FormWrapper from "./FormWrapper";
import FormInput from "./FormInput";
import Link from "next/link";
import { Check } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));
    if (!amount || isNaN(parsedAmount) || parsedAmount < 1000) {
      newErrors.amount = "Minimum donation amount is ₦1,000";
    }
    if (!agreedPrivacy) newErrors.privacy = "You must agree to the Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    return validate();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Fund the next volume."
      subtitle="Your support helps put the next Tech Girls Squad story in more girls' hands."
    >
      <FormWrapper
        formName="fund-the-next-volume"
        onSubmit={handleSubmit}
        submitButtonText="Proceed to Payment"
        isSubmitDisabled={!agreedPrivacy}
        redirectTo="/donation/success"
      >
        <FormInput
          label="Full name"
          required
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={errors.email}
        />

        <FormInput
          label="Amount"
          required
          type="text"
          name="amount"
          placeholder="1,000 minimum"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
          }}
          error={errors.amount}
        />

        <div className="flex items-center gap-2 pt-2">
          <label
            htmlFor="donate-privacy-policy-check"
            className="relative flex items-center gap-2 cursor-pointer select-none group"
          >
            <input
              id="donate-privacy-policy-check"
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => {
                setAgreedPrivacy(e.target.checked);
                if (errors.privacy) setErrors((prev) => ({ ...prev, privacy: "" }));
              }}
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded-md border-1 flex items-center justify-center transition-colors bg-white peer-focus-visible:ring-1 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-[#9E005D] ${
                agreedPrivacy
                  ? "border-[#9E005D]"
                  : "border-[#D2D8E8] group-hover:border-[#9E005D]"
              }`}
            >
              {agreedPrivacy && (
                <Check className="w-3.5 h-3.5 text-[#9E005D] stroke-[2]" />
              )}
            </div>
            <span className="font-manrope text-xs sm:text-sm text-dark">
              I agree to the
            </span>
          </label>
          <Link
            href="/privacy-policy"
            className="text-primary hover:underline font-medium font-manrope text-xs sm:text-sm -ml-1"
            target="_blank"
          >
            Privacy Policy
          </Link>
        </div>
        {errors.privacy && (
          <span className="font-manrope text-xs text-red-500 block">{errors.privacy}</span>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
}
