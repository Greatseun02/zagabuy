"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import DealLayout from "@/components/layouts/DealLayout";
import { DealEntity } from "@/models/responses/dealResponse";

export interface ViewAdminDealModalProps {
  deal: DealEntity;
}

export const ViewAdminDealModal = createAppModal<ViewAdminDealModalProps>(
  ({ deal }, modal) => {
    return <DealLayout {...deal} />;
  },
);

ViewAdminDealModal.displayName = "ViewAdminDealModal";
