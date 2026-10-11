"use client";

import React from "react";
import { useModal } from "./ModalContext";
import GetCopyModal from "./forms/GetCopyModal";
import GiftCopyModal from "./forms/GiftCopyModal";
import DonateModal from "./forms/DonateModal";
import PartnerModal from "./forms/PartnerModal";
import SchoolModal from "./forms/SchoolModal";

export default function GlobalModals() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      <GetCopyModal
        isOpen={activeModal === "get-copy"}
        onClose={closeModal}
      />
      <GiftCopyModal
        isOpen={activeModal === "gift-copy"}
        onClose={closeModal}
      />
      <DonateModal
        isOpen={activeModal === "donate"}
        onClose={closeModal}
      />
      <PartnerModal
        isOpen={activeModal === "partner"}
        onClose={closeModal}
      />
      <SchoolModal
        isOpen={activeModal === "school"}
        onClose={closeModal}
      />
    </>
  );
}
