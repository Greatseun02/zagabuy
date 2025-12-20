"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { CreateOrUpdateTagForm } from "@/components/forms/tags/CreateOrUpdateTagForm";
import { UpdateTagRequest } from "@/models/requests/tagRequest";

export interface CreateTagModalProps {
  onSuccess?: () => void;
}

export const CreateTagModal = createAppModal<CreateTagModalProps>(
  ({ onSuccess }, modal) => {
    return (
      <CreateOrUpdateTagForm
        isUpdate={false}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  }
);

CreateTagModal.displayName = "CreateTagModal";

export interface UpdateTagModalProps {
  tag: UpdateTagRequest;
  onSuccess?: () => void;
}

export const UpdateTagModal = createAppModal<UpdateTagModalProps>(
  ({ tag, onSuccess }, modal) => {
    return (
      <CreateOrUpdateTagForm
        initialValues={tag}
        isUpdate={true}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  }
);

UpdateTagModal.displayName = "UpdateTagModal";
