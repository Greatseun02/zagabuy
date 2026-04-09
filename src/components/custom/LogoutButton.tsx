"use client";
import { useAppDispatch } from "@/configs/storeConfig";
import { authStore } from "@/stores/authStore";
import { Button as BaseButton } from "../ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(authStore.action.logout());
  };

  return (
    <BaseButton
      onClick={handleLogout}
      variant={"ghost"}
      width={"fit"}
      startIcon={<LogOutIcon />}
    >
      Log out
    </BaseButton>
  );
}
