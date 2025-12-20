import { useCallback, useState } from "react";
import { FileUploadState } from "@/components/custom/BaseFileUpload";

/**
 * Custom hook for managing file upload state
 * Single responsibility: Manage upload state and provide actions
 */
export function useFileUploadState() {
  const [uploadStates, setUploadStates] = useState<
    Map<string, FileUploadState>
  >(new Map());

  const updateUploadState = useCallback(
    (fileId: string, updates: Partial<FileUploadState>) => {
      setUploadStates((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(fileId) || {
          fileId,
          status: "pending" as const,
          progress: 0,
        };
        newMap.set(fileId, { ...current, ...updates });
        return newMap;
      });
    },
    []
  );

  const removeUploadState = useCallback((fileId: string) => {
    setUploadStates((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  const clearAllStates = useCallback(() => {
    setUploadStates(new Map());
  }, []);

  return {
    uploadStates,
    updateUploadState,
    removeUploadState,
    clearAllStates,
    getUploadState: (fileId: string) => uploadStates.get(fileId),
  };
}

export default useFileUploadState;
