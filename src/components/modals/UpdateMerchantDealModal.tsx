"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import CreateOrUpdateDealForm from "@/components/forms/CreateOrUpdateDealForm";
import { DealEntity } from "@/models/responses/dealResponse";
import { UpdateDealRequest } from "@/models/requests/dealRequest";

export interface UpdateMerchantDealModalProps {
  deal: DealEntity;
  onSuccess?: () => void;
}

function mapDealToUpdateRequest(deal: DealEntity): UpdateDealRequest {
  return {
    dealId: deal.dealId,
    dealTitle: deal.dealTitle,
    dealDescription: deal.dealDescription,
    dealPrice: deal.dealPrice,
    dealOldPrice: deal.dealOldPrice,
    dealPromoCode: deal.dealPromoCode,
    dealUrl: deal.dealUrl,
    dealExpiryDate: deal.dealExpiryDate,
    dealImagesUrl: deal.dealImages,
    dealVisibility: deal.dealVisibility,
    dealStatus: deal.dealStatus,
    dealUserId: deal.dealUserId,
    dealApprovedBy: deal.dealApprovedBy,
    dealViews: deal.dealViews,
  };
}

export const UpdateMerchantDealModal =
  createAppModal<UpdateMerchantDealModalProps>(({ deal, onSuccess }, modal) => {
    return (
      <CreateOrUpdateDealForm
        isUpdate={true}
        initialValues={mapDealToUpdateRequest(deal)}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  });

UpdateMerchantDealModal.displayName = "UpdateMerchantDealModal";
