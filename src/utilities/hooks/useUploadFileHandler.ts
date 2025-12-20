"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/configs/storeConfig";
import { fileStore } from "@/stores/fileStore";
import type { FileUploadHandler } from "@/components/custom/BaseFileUpload";
import { BaseUtil } from "../baseUtil";

export const useUploadFileHandler = (
  generateUploadUrl: (args: {
    fileName: string;
    contentType?: string;
  }) => Promise<{ expiresIn?: number; key?: string; url?: string }>
) => {
  const dispatch = useAppDispatch();
  const progress = useAppSelector((state) => state.file.progress);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFileHandler: FileUploadHandler = async (
    file,
    __,
    onProgress,
    onStatusChange
  ) => {
    try {
      setIsUploading(true);
      onStatusChange("uploading");
      onProgress(progress);

      const { url: uploadUrl, key: blobUrl } = await generateUploadUrl({
        fileName: file.name,
        contentType: file.type,
      });

      BaseUtil.logger(uploadUrl, blobUrl, "Use Uploader");

      const result = await dispatch(
        fileStore.action.uploadFile({
          file,
          uploadUrl: uploadUrl ?? "",
          blobUrl: blobUrl ?? "",
        })
      ).unwrap();

      onStatusChange("completed");

      return { url: uploadUrl?.split("?")[0] };
    } catch (err) {
      onStatusChange("failed", "Failed to upload file");
      throw err;
    } finally {
      setIsUploading(false);
      dispatch(fileStore.mutation.resetProgress());
    }
  };

  return { uploadFileHandler, isUploading, progress };
};
