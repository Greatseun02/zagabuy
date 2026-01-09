"use client";

import BaseFormLayout from "@/components/layouts/baseFormLayout";
import BaseAvatar from "@/components/ui/BaseAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/configs/storeConfig";
import { updateUserRequestInit } from "@/models/requests/user/UpdateUserRequest";
import { UserEntity } from "@/models/responses/user/ReadAllUsersResponse";
import { UserValidation } from "@/models/validations/UserValidation";
import { useUpdateUserMutation } from "@/services/userService";
import { BaseUtil } from "@/utilities/baseUtil";
import { useFormik } from "formik";
import { isNullOrUndefined } from "node:util";
import { useEffect } from "react";
import { toast } from "sonner";

type EditMerchantProfileFormProps = {
  //   user?: Partial<UserEntity>;
};

export default function EditMerchantProfileForm({}: //   user,
EditMerchantProfileFormProps) {
  const [updateUser] = useUpdateUserMutation();
  const user = useAppSelector((state) => state.auth.userInfo);

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
            response?.responseMessage || "Profile updated successfully"
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
  });

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <BaseFormLayout
      onSubmit={formik.handleSubmit}
      title="Edit Merchant Profile"
      className="max-w-xl  mx-auto rounded-xl shadow-[0px_0px_24px_-4px_rgba(0,0,0,0.1)] px-8 pt-8 pb-14"
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
      <Input
        name="userFirstName"
        formik={formik}
        label="First Name"
        placeholder="Enter First Name e.g John"
      />
      <Input
        name="userLastName"
        formik={formik}
        label="Last Name"
        placeholder="Enter Last Name e.g Doe"
      />
      <Input
        name="userPhoneNumber"
        formik={formik}
        label="Phone Number"
        placeholder="Enter Phone Number e.g 1234567890"
      />
      <Input
        name="userUsername"
        formik={formik}
        label="Username"
        placeholder="Enter Username e.g john_doe"
      />
      <Button type="submit" className="mt-6" isLoading={formik.isSubmitting}>
        Save
      </Button>
    </BaseFormLayout>
  );
}
