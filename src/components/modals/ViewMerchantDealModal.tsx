"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import DealLayout from "@/components/layouts/DealLayout";
import { DealEntity } from "@/models/responses/dealResponse";

export interface ViewMerchantDealModalProps {
  deal: DealEntity;
}

export const ViewMerchantDealModal =
  createAppModal<ViewMerchantDealModalProps>(({ deal }, modal) => {
    return <DealLayout {...deal} />;
  });

ViewMerchantDealModal.displayName = "ViewMerchantDealModal";
