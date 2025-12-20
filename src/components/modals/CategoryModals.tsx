"use client";

import { createAppModal } from "@/utilities/modalUtils/createAppModal";
import { CreateOrUpdateCategoryForm } from "@/components/forms/categories/CreateOrUpdateCategoryForm";
import { UpdateCategoryRequest } from "@/models/requests/categoryRequest";

export interface CreateCategoryModalProps {
  onSuccess?: () => void;
}

export const CreateCategoryModal = createAppModal<CreateCategoryModalProps>(
  ({ onSuccess }, modal) => {
    return (
      <CreateOrUpdateCategoryForm
        isUpdate={false}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  }
);

CreateCategoryModal.displayName = "CreateCategoryModal";

export interface UpdateCategoryModalProps {
  category: UpdateCategoryRequest;
  onSuccess?: () => void;
}

export const UpdateCategoryModal = createAppModal<UpdateCategoryModalProps>(
  ({ category, onSuccess }, modal) => {
    return (
      <CreateOrUpdateCategoryForm
        initialValues={category}
        isUpdate={true}
        onSuccessfulSubmission={() => {
          onSuccess?.();
          modal.hide();
        }}
      />
    );
  }
);

UpdateCategoryModal.displayName = "UpdateCategoryModal";
