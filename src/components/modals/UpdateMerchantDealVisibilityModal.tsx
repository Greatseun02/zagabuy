"use client";

import { useState } from "react";
import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { DealEntity } from "@/models/responses/dealResponse";
import { useUpdateDealMutation } from "@/services/dealService";
import { Button as BaseButton } from "@/components/ui/button";
import { toast } from "sonner";
import { BaseUtil } from "@/utilities/baseUtil";

export interface UpdateMerchantDealVisibilityModalProps {
  deal: DealEntity;
  onSuccess?: () => void;
}

export const UpdateMerchantDealVisibilityModal =
  createAppModal<UpdateMerchantDealVisibilityModalProps>(
    ({ deal, onSuccess }, modal) => {
      const [visibility, setVisibility] = useState(deal.dealVisibility);
      const [updateDeal, { isLoading }] = useUpdateDealMutation();

      const handleSubmit = async () => {
        const response = await updateDeal({
          dealId: deal.dealId,
          dealVisibility: visibility,
        }).unwrap();

        if (BaseUtil.isApiResponseSuccessful(response)) {
          toast.success("Visibility updated successfully");
          onSuccess?.();
          modal.hide();
        } else {
          toast.error(response?.responseMessage || "Failed to update visibility");
        }
      };

      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {(["PUBLIC", "PRIVATE"] as const).map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  visibility === option
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={() => setVisibility(option)}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {option === "PUBLIC" ? "Public" : "Private"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option === "PUBLIC"
                      ? "Visible to all users on the platform"
                      : "Only visible to you via direct link"}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <BaseButton
              type="button"
              variant="ghost"
              onClick={() => modal.hide()}
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="button"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={visibility === deal.dealVisibility}
            >
              Update Visibility
            </BaseButton>
          </div>
        </div>
      );
    }
  );

UpdateMerchantDealVisibilityModal.displayName =
  "UpdateMerchantDealVisibilityModal";
