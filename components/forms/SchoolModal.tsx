"use client";

import React, { useState } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import FormWrapper from "./FormWrapper";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import Link from "next/link";
import { Check } from "lucide-react";

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolModal({ isOpen, onClose }: SchoolModalProps) {
  const [schoolName, setSchoolName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [numCopies, setNumCopies] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!schoolName.trim()) newErrors.schoolName = "Please enter your school name.";
    if (!contactPerson.trim()) newErrors.contactPerson = "Please enter contact person name.";
    if (!role.trim()) newErrors.role = "Please enter your role.";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone.trim()) newErrors.phone = "Enter a valid phone number";
    if (!deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";
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
      title="Order for Your School."
      subtitle="Tell us about your school and how many copies you're looking for."
    >
      <FormWrapper
        formName="order-for-your-school"
        onSubmit={handleSubmit}
        submitButtonText="Place your Order"
        isSubmitDisabled={!agreedPrivacy}
      >
        <FormInput
          label="School name"
          required
          type="text"
          name="schoolName"
          value={schoolName}
          onChange={(e) => {
            setSchoolName(e.target.value);
            if (errors.schoolName) setErrors((prev) => ({ ...prev, schoolName: "" }));
          }}
          error={errors.schoolName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Contact person"
            required
            type="text"
            name="contactPerson"
            value={contactPerson}
            onChange={(e) => {
              setContactPerson(e.target.value);
              if (errors.contactPerson) setErrors((prev) => ({ ...prev, contactPerson: "" }));
            }}
            error={errors.contactPerson}
          />
          <FormInput
            label="Your role"
            required
            type="text"
            name="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
            }}
            error={errors.role}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Email address"
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
            label="Phone number"
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
          label="Number of Copies"
          required
          type="number"
          name="numCopies"
          min={1}
          value={numCopies}
          onChange={(e) => setNumCopies(parseInt(e.target.value) || 1)}
        />

        <FormInput
          label="Delivery Address"
          required
          type="text"
          name="deliveryAddress"
          value={deliveryAddress}
          onChange={(e) => {
            setDeliveryAddress(e.target.value);
            if (errors.deliveryAddress) setErrors((prev) => ({ ...prev, deliveryAddress: "" }));
          }}
          error={errors.deliveryAddress}
        />

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

        <div className="flex items-center gap-2 pt-2">
          <label
            htmlFor="school-privacy-policy-check"
            className="relative flex items-center gap-2 cursor-pointer select-none group"
          >
            <input
              id="school-privacy-policy-check"
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
