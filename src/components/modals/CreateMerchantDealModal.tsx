"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";

export interface CreateMerchantDealModalProps {
  onSuccess?: () => void;
}

export const CreateMerchantDealModal =
  createAppModal<CreateMerchantDealModalProps>(({ onSuccess }, modal) => {
    return (
      <CreateOrUpdateDealForm
        isUpdate={false}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  });

CreateMerchantDealModal.displayName = "CreateMerchantDealModal";
