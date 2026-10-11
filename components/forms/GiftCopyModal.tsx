"use client";

import React, { useState, useMemo } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import FormWrapper from "./FormWrapper";
import FormInput from "./FormInput";
import Link from "next/link";
import { Check } from "lucide-react";

const PRICE_PER_COPY = 5000;

interface GiftCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GiftCopyModal({ isOpen, onClose }: GiftCopyModalProps) {
  const [numCopies, setNumCopies] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = useMemo(() => {
    return Math.max(1, numCopies) * PRICE_PER_COPY;
  }, [numCopies]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone.trim()) newErrors.phone = "Enter a valid phone number";
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
      title="Give a book to a girl who needs it."
      subtitle="Choose how many copies you'd like to gift."
    >
      <FormWrapper
        formName="gift-a-copy"
        onSubmit={handleSubmit}
        submitButtonText="Proceed to Payment"
        isSubmitDisabled={!agreedPrivacy}
        redirectTo="/order/gift"
      >
        <FormInput
          label="Number of Copies"
          required
          type="number"
          name="numCopies"
          min={1}
          value={numCopies}
          onChange={(e) => setNumCopies(parseInt(e.target.value) || 1)}
        />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Phone No"
            required
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            error={errors.phone}
          />
        </div>

        {numCopies > 1 && (
          <div className="space-y-3 pt-6 text-sm sm:text-base font-medium font-manrope text-dark">
            <div className="flex items-center justify-between">
              <span>
                Gifted copies: {numCopies} × ₦{PRICE_PER_COPY.toLocaleString()}
              </span>
              <span className="font-semibold">
                ₦{(numCopies * PRICE_PER_COPY).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className={`${numCopies <= 1 ? "" : ""} flex items-center justify-between mt-2`}>
          <span className="font-manrope font-bold text-base sm:text-lg text-dark">
            Total Amount
          </span>
          <span className="font-manrope font-bold text-lg sm:text-xl text-dark">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <label
            htmlFor="gift-privacy-policy-check"
            className="relative flex items-center gap-2 cursor-pointer select-none group"
          >
            <input
              id="gift-privacy-policy-check"
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
