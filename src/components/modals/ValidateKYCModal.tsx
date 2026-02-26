"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import BaseTab, { BaseTabItem } from "@/components/ui/BaseTab";
import { ValidateBvnForm } from "@/components/forms/ValidateBvnForm";
import { ValidateNinForm } from "@/components/forms/ValidateNinForm";

export interface ValidateKYCModalProps {
  onSuccess?: () => void;
}

export const ValidateKYCModal = createAppModal<ValidateKYCModalProps>(
  ({ onSuccess }, modal) => {
    // const tabs: BaseTabItem[] = [
    //   {
    //     id: "bvn",
    //     label: "Validate BVN",
    //     content: (
    //       <ValidateBvnForm
    //         onSuccessfulSubmission={() => {
    //           onSuccess?.();
    //           modal.hide();
    //         }}
    //       />
    //     ),
    //   },
    //   {
    //     id: "nin",
    //     label: "Validate NIN",
    //     content: (
    //       <ValidateNinForm
    //         onSuccessfulSubmission={() => {
    //           onSuccess?.();
    //           modal.hide();
    //         }}
    //       />
    //     ),
    //   },
    // ];

    // return <BaseTab tabs={tabs} />;
    return (
      <ValidateNinForm
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  },
);

ValidateKYCModal.displayName = "ValidateKYCModal";
