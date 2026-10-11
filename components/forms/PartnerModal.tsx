"use client";

import React, { useState, useMemo } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import FormWrapper from "./FormWrapper";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import Link from "next/link";
import { Check } from "lucide-react";
import nigeriaStatesLgas from "@/data/nigeria_states_lgas.json";

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerModal({ isOpen, onClose }: PartnerModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [message, setMessage] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countriesList = ["Nigeria"];
  const statesList = useMemo(() => Object.keys(nigeriaStatesLgas), []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone.trim()) newErrors.phone = "Enter a valid phone number";
    if (!selectedCountry) newErrors.country = "Please select a country";
    if (!selectedState) newErrors.state = "Please select a state";
    if (!message.trim()) newErrors.message = "Please enter a message";
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
      title="Partner With Us"
      subtitle="Collaborate with us on school outreach, sponsorships, translations, or future volumes."
    >
      <FormWrapper
        formName="partner-with-us"
        onSubmit={handleSubmit}
        submitButtonText="Send Message"
        isSubmitDisabled={!agreedPrivacy}
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

        <FormInput
          label="Organization"
          type="text"
          name="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Country"
            required
            options={countriesList}
            value={selectedCountry}
            onChange={(val) => {
              setSelectedCountry(val);
              if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
            }}
            placeholder="Select country"
            error={errors.country}
          />
          <FormSelect
            label="State"
            required
            options={statesList}
            value={selectedState}
            onChange={(val) => {
              setSelectedState(val);
              if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
            }}
            placeholder="Select state"
            error={errors.state}
          />
        </div>

        <FormTextarea
          label="Message"
          required
          name="message"
          rows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
          }}
          error={errors.message}
        />

        <div className="flex items-start gap-2 pt-2">
          <label
            htmlFor="partner-privacy-policy-check"
            className="relative flex items-start gap-2 cursor-pointer select-none group"
          >
            <input
              id="partner-privacy-policy-check"
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => {
                setAgreedPrivacy(e.target.checked);
                if (errors.privacy) setErrors((prev) => ({ ...prev, privacy: "" }));
              }}
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded-md border-1 flex items-center justify-center transition-colors bg-white peer-focus-visible:ring-1 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-[#9E005D] shrink-0 mt-0.5 ${
                agreedPrivacy
                  ? "border-[#9E005D]"
                  : "border-[#D2D8E8] group-hover:border-[#9E005D]"
              }`}
            >
              {agreedPrivacy && (
                <Check className="w-3.5 h-3.5 text-[#9E005D] stroke-[2]" />
              )}
            </div>
            <span className="font-manrope text-xs sm:text-sm text-dark leading-snug">
              I agree to the{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                Privacy Policy
              </Link>{" "}
              and consent to being contacted about this enquiry.
            </span>
          </label>
        </div>
        {errors.privacy && (
          <span className="font-manrope text-xs text-red-500 block">{errors.privacy}</span>
        )}
      </FormWrapper>
    </ModalWrapper>
  );
}
