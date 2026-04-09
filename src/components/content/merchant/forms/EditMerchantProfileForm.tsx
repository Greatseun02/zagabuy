"use client";

import BaseFormLayout from "@/components/layouts/baseFormLayout";
import BaseAvatar from "@/components/ui/BaseAvatar";
import { Button as BaseButton } from "@/components/ui/button";
import { Input as BaseInput } from "@/components/ui/input";
import { useAppSelector } from "@/configs/storeConfig";
import { updateUserRequestInit } from "@/models/requests/user/UpdateUserRequest";
import { UserEntity } from "@/models/responses/user/ReadAllUsersResponse";
import { UserValidation } from "@/models/validations/UserValidation";
import {
  useReadAllUsersQuery,
  useReadUsersByUserIdQuery,
  useUpdateUserMutation,
} from "@/services/userService";
import { BaseUtil } from "@/utilities/baseUtil";
import { useFormik } from "formik";
import { useMemo } from "react";
import { toast } from "sonner";

type EditMerchantProfileFormProps = {
  //   user?: Partial<UserEntity>;
};

export default function EditMerchantProfileForm({}: //   user,
EditMerchantProfileFormProps) {
  const userId = useAppSelector((state) => state.auth.userInfo.userId);

  const [updateUser] = useUpdateUserMutation();
  const { data } = useReadUsersByUserIdQuery(userId);

  const user = useMemo(() => data?.data, [data?.data]);

  const formik = useFormik({
    initialValues: {
      userFirstName: user?.userFirstName || "",
      userLastName: user?.userLastName || "",
      userPhoneNumber: user?.userPhoneNumber || "",
      userUsername: user?.userUsername || "",
      userId: user?.userId || 0,
    },
    onSubmit: async (values) => {
      try {
        const response = await updateUser(values).unwrap();

        if (BaseUtil.isApiResponseSuccessful(response)) {
          toast.success(
            response?.responseMessage || "Profile updated successfully",
          );
        } else {
          toast.error(response?.responseMessage || "Failed to update profile");
        }
      } catch (error) {
        toast.error("An error occurred while updating profile");
        BaseUtil.logger(error);
      }
    },
    validationSchema: UserValidation.EditUserProfileSchema,
    enableReinitialize: true,
  });

  return (
    <BaseFormLayout
      onSubmit={formik.handleSubmit}
      title="Edit Merchant Profile"
      className="max-w-xl mx-auto rounded-xl shadow-[0px_0px_32px_-6px_rgba(0,0,0,0.25)] dark:shadow-[0px_0px_32px_-6px_rgba(0,0,0,0.7)] dark:border  px-14 pt-14 pb-20"
    >
      <BaseAvatar
        text={
          user?.userFirstName && user?.userLastName
            ? `${user?.userFirstName} ${user?.userLastName}`
            : undefined
        }
        size="lg"
        className="mx-auto mb-5"
      />
      <div className="grid gap-4 grid-cols-2">
        <BaseInput
          name="userFirstName"
          formik={formik}
          label="First Name"
          placeholder="Enter First Name e.g John"
        />
        <BaseInput
          name="userLastName"
          formik={formik}
          label="Last Name"
          placeholder="Enter Last Name e.g Doe"
        />
      </div>

      <BaseInput
        name="userPhoneNumber"
        formik={formik}
        label="Phone Number"
        placeholder="Enter Phone Number e.g 1234567890"
      />
      <BaseInput
        name="userUsername"
        formik={formik}
        label="Username"
        placeholder="Enter Username e.g john_doe"
      />
      <BaseButton type="submit" className="mt-6" isLoading={formik.isSubmitting}>
        Save
      </BaseButton>
    </BaseFormLayout>
  );
}
