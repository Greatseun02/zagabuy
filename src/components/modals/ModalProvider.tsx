"use client";

import NiceModal from "@ebay/nice-modal-react";
import React from "react";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return <NiceModal.Provider>{children}</NiceModal.Provider>;
}
