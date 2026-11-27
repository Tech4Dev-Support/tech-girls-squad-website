"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import ModalWrapper from "../UI/ModalWrapper";
import FormWrapper from "./FormWrapper";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormToggle from "./FormToggle";
import Link from "next/link";
import { Check } from "lucide-react";
import nigeriaStatesLgas from "@/data/nigeria_states_lgas.json";
import { createIdempotencyKey, initializePayment } from "@/lib/api";

const PRICE_PER_COPY = 5000;

interface GetCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetCopyModal({ isOpen, onClose }: GetCopyModalProps) {
  
  const [numCopiesInput, setNumCopiesInput] = useState<string>("1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLga, setSelectedLga] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [nearestLandmark, setNearestLandmark] = useState("");
  const [isGifted, setIsGifted] = useState(false);
  const [giftNumCopiesInput, setGiftNumCopiesInput] = useState<string>("1");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const numCopies = Math.max(1, parseInt(numCopiesInput, 10) || 1);
  const giftNumCopies = Math.max(1, parseInt(giftNumCopiesInput, 10) || 1);

  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const idempotencyKeyRef = useRef<string>("");

  useEffect(() => {
    if (isOpen) {
      idempotencyKeyRef.current = createIdempotencyKey();
    }
  }, [isOpen]);

  
  const statesList = useMemo(() => Object.keys(nigeriaStatesLgas), []);

  
  const lgasList = useMemo(() => {
    if (!selectedState) return [];
    return (nigeriaStatesLgas as Record<string, string[]>)[selectedState] || [];
  }, [selectedState]);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedLga("");
    if (errors.state) {
      setErrors((prev) => ({ ...prev, state: "" }));
    }
  };

  
  const totalAmount = useMemo(() => {
    const userTotal = Math.max(1, numCopies) * PRICE_PER_COPY;
    const giftTotal = isGifted ? Math.max(1, giftNumCopies) * PRICE_PER_COPY : 0;
    return userTotal + giftTotal;
  }, [numCopies, isGifted, giftNumCopies]);

  
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Please enter your full name.";
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!phone.trim()) newErrors.phone = "Enter a valid phone number";
    if (!selectedState) newErrors.state = "Please select a state";
    if (!selectedLga) newErrors.lga = "Please select an LGA";
    if (!deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";
    if (!nearestLandmark.trim()) newErrors.nearestLandmark = "Nearest landmark is required";
    if (!agreedPrivacy) newErrors.privacy = "You must agree to the Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return false;

    const idempotencyKey =
      idempotencyKeyRef.current || (idempotencyKeyRef.current = createIdempotencyKey());

    return initializePayment({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      copiesForMe: Math.max(1, numCopies),
      copiesToGift: isGifted ? Math.max(1, giftNumCopies) : 0,
      country: "Nigeria",
      state: selectedState,
      lga: selectedLga,
      addressLine: deliveryAddress.trim(),
      landmark: nearestLandmark.trim(),
      consent: true,
      idempotencyKey,
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Get Your Copy."
      subtitle="Tell us where to send your book."
    >
      <FormWrapper
        onSubmit={handleSubmit}
        submitButtonText="Proceed to Payment"
        isSubmitDisabled={!agreedPrivacy}
      >
        <FormInput
          label="Number of Copies"
          required
          type="text"
          inputMode="numeric"
          name="numCopies"
          value={numCopiesInput}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            setNumCopiesInput(digits);
          }}
          onBlur={() => {
            const parsed = parseInt(numCopiesInput, 10);
            setNumCopiesInput(String(Number.isFinite(parsed) && parsed >= 1 ? parsed : 1));
          }}
          onStep={(delta) => setNumCopiesInput(String(Math.max(1, numCopies + delta)))}
          disableDecrement={numCopies <= 1}
        />

        <FormInput
          label="Name"
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
            label="Email"
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
          label="Country"
          required
          type="text"
          name="country"
          value="Nigeria"
          readOnly
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="State"
            required
            options={statesList}
            value={selectedState}
            onChange={handleStateChange}
            placeholder="Select state"
            error={errors.state}
          />
          <FormSelect
            label="LGA"
            required
            options={lgasList}
            value={selectedLga}
            onChange={(val) => {
              setSelectedLga(val);
              if (errors.lga) setErrors((prev) => ({ ...prev, lga: "" }));
            }}
            placeholder="Select LGA"
            disabled={!selectedState}
            error={errors.lga}
          />
        </div>

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

        <FormInput
          label="Nearest Landmark"
          required
          type="text"
          name="nearestLandmark"
          placeholder="e.g. beside"
          value={nearestLandmark}
          onChange={(e) => {
            setNearestLandmark(e.target.value);
            if (errors.nearestLandmark) setErrors((prev) => ({ ...prev, nearestLandmark: "" }));
          }}
          error={errors.nearestLandmark}
        />

        <div className="pt-2">
          <FormToggle
            label="Gift a copy too?"
            checked={isGifted} 
            onChange={setIsGifted}
          />
        </div>

        {isGifted && (
          <div className="space-y-6 pt-1 animate-fade-in">
            <FormInput
              label="Number of Copies"
              required
              type="text"
              inputMode="numeric"
              name="giftNumCopies"
              value={giftNumCopiesInput}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setGiftNumCopiesInput(digits);
              }}
              onBlur={() => {
                const parsed = parseInt(giftNumCopiesInput, 10);
                setGiftNumCopiesInput(String(Number.isFinite(parsed) && parsed >= 1 ? parsed : 1));
              }}
              onStep={(delta) => setGiftNumCopiesInput(String(Math.max(1, giftNumCopies + delta)))}
              disableDecrement={giftNumCopies <= 1}
            />

            <div className="space-y-3 pt-6 border-t-[1.5px] border-[#D2D8E8] text-sm sm:text-base font-medium 
            font-manrope text-dark"> 
              <div className="flex items-center justify-between">
                <span>
                  Your copies: {numCopies} × ₦{PRICE_PER_COPY.toLocaleString()} 
                </span>
                <span className="font-semibold">
                  ₦{(numCopies * PRICE_PER_COPY).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  Gifted copies: {giftNumCopies} × ₦{PRICE_PER_COPY.toLocaleString()}
                </span>
                <span className="font-semibold">
                  ₦{(giftNumCopies * PRICE_PER_COPY).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className={`${!isGifted ? "border-t-[1.5px] border-[#D2D8E8] pt-6" : ""}  flex items-center justify-between mt-2`}> 
          <span className="font-manrope font-bold text-base sm:text-lg text-dark">
            Total Amount
          </span>
          <span className="font-manrope font-bold text-lg sm:text-xl text-dark">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <label
            htmlFor="privacy-policy-check"
            className="relative flex items-center gap-2 cursor-pointer select-none group"
          >
            <input
              id="privacy-policy-check"
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
