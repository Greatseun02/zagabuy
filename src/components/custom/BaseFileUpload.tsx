import React, { CSSProperties, useCallback, useEffect, useRef } from "react";
import BaseDropzone from "@/components/custom/BaseDropzone";
import FilePreview from "@/components/custom/FilePreview";
import { FileUploadUtil } from "@/utilities/fileUploadUtil";
import { useFileUploadState } from "@/utilities/hooks/useFileUploadState";
import Typography from "../ui/typography";
import { FormikValues } from "formik";
import { Formik } from "@/utilities/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

/**
 * Base file representation - works for both new uploads and existing files
 * Single responsibility: Represent a file in the system
 */
export interface FileItem {
  id: string; // Unique identifier
  name: string; // Display name
  size?: number; // File size in bytes
  type?: string; // MIME type
  url?: string; // For existing files from server
  file?: File; // For new file uploads
  metadata?: Record<string, unknown>; // Extensible metadata
}

/**
 * Upload state for files being processed
 * Single responsibility: Track upload progress and status
 */
export interface FileUploadState {
  fileId: string;
  status: "pending" | "uploading" | "completed" | "failed" | "cancelled";
  progress: number; // 0-100
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * Upload handler function type
 * Interface segregation: Separate concerns of upload logic
 */
export type FileUploadHandler = (
  file: File,
  fileId: string,
  onProgress: (progress: number) => void,
  onStatusChange: (status: FileUploadState["status"], error?: string) => void
) => Promise<{ url?: string; metadata?: unknown }>;

export interface FileUploadProps<T extends FormikValues = FormikValues> {
  showDownload?: boolean;
  showView?: boolean;
  showPreview?: boolean; // For inline preview/thumbnail

  // File action handlers
  onDownload?: (fileItem: FileItem, fileUrl: string) => void;
  onView?: (fileItem: FileItem, fileUrl: string) => void;
  onPreview?: (fileItem: FileItem, fileUrl: string) => void;

  // Default action behavior
  enableDefaultDownload?: boolean;
  enableDefaultView?: boolean;

  // Core functionality
  files?: FileItem[]; // Made optional for Formik integration
  onChange?: (files: FileItem[]) => void; // Made optional for Formik integration

  // Formik integration (similar to ModernSelect)
  formik?: Formik<T>;
  name?: string;
  value?: FileItem[]; // Direct value prop for controlled usage

  // Upload configuration
  uploadHandler?: FileUploadHandler;
  autoUpload?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];

  // UI configuration
  showProgress?: boolean;
  showFileSize?: boolean;
  allowReorder?: boolean;
  disabled?: boolean;

  // Validation and errors
  validate?: (files: FileItem[]) => string | null;
  error?: string; // External error prop

  // Labels and text
  label?: string;
  labelStyle?: CSSProperties;
  labelClassName?: string;
  containerStyle?: React.CSSProperties | undefined;
  placeholder?: string;
  helperText?: string;
  helperTextProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >;

  // Event handlers
  onUploadComplete?: (fileItem: FileItem, result: unknown) => void;
  onUploadError?: (fileItem: FileItem, error: string) => void;
  onFileRemove?: (fileItem: FileItem) => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}

const BaseFileUpload = <T extends FormikValues>({
  // file action props
  showDownload = true,
  showView = true,
  showPreview = false,
  onDownload,
  onView,
  onPreview,
  enableDefaultDownload = true,
  enableDefaultView = true,

  // Core props - now with Formik fallbacks
  files,
  onChange,

  // Formik integration
  formik,
  name = "",
  value,

  // Upload configuration
  uploadHandler,
  autoUpload = true,
  multiple = true,
  maxFiles,
  maxSize,
  accept,

  // UI configuration
  showProgress = true,
  showFileSize = true,
  disabled = false,

  // Validation and errors
  validate,
  error,

  // Labels and text
  label,
  labelStyle,
  labelClassName,
  containerStyle,
  placeholder = "Drop files here or click to upload",
  helperText,
  helperTextProps,

  // Event handlers
  onUploadComplete,
  onUploadError,
  onFileRemove,

  // Styling
  className,
  style,
}: FileUploadProps<T>) => {
  const { uploadStates, updateUploadState, removeUploadState } =
    useFileUploadState();
  const uploadAbortControllers = useRef<Map<string, AbortController>>(
    new Map()
  );
  const blobUrls = useRef<Set<string>>(new Set()); // Track blob URLs for cleanup

  // ============= FORMIK INTEGRATION LOGIC =============

  /**
   * Get current files from props, Formik, or value
   * Priority: value prop > files prop > formik value
   */
  const getCurrentFiles = useCallback((): FileItem[] => {
    if (value !== undefined) return value;
    if (files !== undefined) return files;
    if (formik && name && formik.values[name]) {
      const formikValue = formik.values[name];
      // Handle both FileItem[] and File[] from Formik
      if (Array.isArray(formikValue)) {
        return formikValue.map((item) =>
          item.id
            ? (item as FileItem)
            : FileUploadUtil.createFileItemFromFile(item as File)
        );
      }
      return [];
    }
    return [];
  }, [value, files, formik, name]);

  /**
   * Update files with proper fallback to Formik
   */
  const updateFiles = useCallback(
    (newFiles: FileItem[] | ((prev: FileItem[]) => FileItem[])) => {
      const updatedFiles =
        typeof newFiles === "function" ? newFiles(getCurrentFiles()) : newFiles;

      // Call external onChange if provided
      onChange?.(updatedFiles);

      // Update Formik if integrated
      if (formik && name) {
        formik.setFieldValue(name, updatedFiles);
        // Also mark field as touched for validation
        if (!formik.touched[name]) {
          formik.setFieldTouched(name, true);
        }
      }
    },
    [getCurrentFiles, onChange, formik, name]
  );

  /**
   * Get current error state (external error > formik error > validation error)
   */
  const getCurrentError = useCallback((): string | null => {
    // External error takes priority
    if (error) return error;

    // Formik error
    if (formik && name && formik.touched[name] && formik.errors[name]) {
      const formikError = formik.errors[name];
      return typeof formikError === "string" ? formikError : "Invalid files";
    }

    // Validation error
    if (validate) {
      return validate(getCurrentFiles());
    }

    return null;
  }, [error, formik, name, validate, getCurrentFiles]);

  /**
   * Check if field is touched (for error display)
   */
  const isFieldTouched = useCallback((): boolean => {
    if (formik && name) return !!formik.touched[name];
    return getCurrentFiles().length > 0;
  }, [formik, name, getCurrentFiles]);

  // ============= FILE MANAGEMENT LOGIC =============

  // File validation
  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(
          1
        )}MB`;
      }

      if (accept && accept.length > 0) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const mimeType = file.type.toLowerCase();

        const isAccepted = accept.some((acceptType) => {
          if (acceptType.startsWith(".")) {
            return acceptType.slice(1).toLowerCase() === fileExtension;
          }
          if (acceptType.includes("*")) {
            const [type] = acceptType.split("/");
            return mimeType.startsWith(type);
          }
          return acceptType.toLowerCase() === mimeType;
        });

        if (!isAccepted) {
          return `File type not allowed. Accepted types: ${accept.join(", ")}`;
        }
      }

      return null;
    },
    [maxSize, accept]
  );

  // Handle new file drops
  const handleFileDrop = useCallback(
    (droppedFiles: File[]) => {
      if (disabled) return;

      const currentFiles = getCurrentFiles();

      // Validate each file
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of droppedFiles) {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      }

      // Check file count limits
      const totalFiles = currentFiles.length + validFiles.length;
      if (maxFiles && totalFiles > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Show validation errors
      if (errors.length > 0) {
        console.warn("File validation errors:", errors);
        // You could also set a formik error here
        if (formik && name) {
          formik.setFieldError(name, errors.join(", "));
        }
        return;
      }

      // Create file items
      const newFileItems = validFiles.map((file) =>
        FileUploadUtil.createFileItemFromFile(file)
      );

      // Update files list
      const updatedFiles = multiple
        ? [...currentFiles, ...newFileItems]
        : newFileItems;
      updateFiles(updatedFiles);

      // Auto upload if enabled
      if (autoUpload && uploadHandler) {
        newFileItems.forEach((fileItem) => {
          if (fileItem.file) {
            handleFileUpload(fileItem);
          }
        });
      }
    },
    [
      getCurrentFiles,
      multiple,
      maxFiles,
      validateFile,
      autoUpload,
      uploadHandler,
      disabled,
      updateFiles,
      formik,
      name,
    ]
  );

  // Handle individual file upload
  const handleFileUpload = useCallback(
    async (fileItem: FileItem) => {
      if (!uploadHandler || !fileItem.file) return;

      const abortController = new AbortController();
      uploadAbortControllers.current.set(fileItem.id, abortController);

      try {
        updateUploadState(fileItem.id, {
          status: "uploading",
          progress: 0,
          startedAt: new Date(),
        });

        const result = await uploadHandler(
          fileItem.file,
          fileItem.id,
          (progress) => updateUploadState(fileItem.id, { progress }),
          (status, error) => updateUploadState(fileItem.id, { status, error })
        );

        updateUploadState(fileItem.id, {
          status: "completed",
          progress: 100,
          completedAt: new Date(),
        });

        // Update file item with result
        const updatedFileItem: FileItem = {
          ...fileItem,
          url: result.url,
          metadata: {
            ...(fileItem.metadata ?? {}), // ensure it's an object
            ...(result.metadata ?? {}), // ensure it's an object
          },
        };

        // Update files array
        const currentFiles = getCurrentFiles();
        updateFiles(
          currentFiles.map((f) => (f.id === fileItem.id ? updatedFileItem : f))
        );

        onUploadComplete?.(updatedFileItem, result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        updateUploadState(fileItem.id, {
          status: "failed",
          error: errorMessage,
        });
        onUploadError?.(fileItem, errorMessage);
      } finally {
        uploadAbortControllers.current.delete(fileItem.id);
      }
    },
    [
      uploadHandler,
      updateUploadState,
      getCurrentFiles,
      updateFiles,
      onUploadComplete,
      onUploadError,
    ]
  );

  // Remove file
  const handleFileRemove = useCallback(
    (fileItem: FileItem) => {
      // Cancel upload if in progress
      const abortController = uploadAbortControllers.current.get(fileItem.id);
      if (abortController) {
        abortController.abort();
        uploadAbortControllers.current.delete(fileItem.id);
      }

      // Remove from state
      removeUploadState(fileItem.id);

      const currentFiles = getCurrentFiles();
      updateFiles(currentFiles.filter((f) => f.id !== fileItem.id));

      onFileRemove?.(fileItem);
    },
    [getCurrentFiles, updateFiles, removeUploadState, onFileRemove]
  );

  // Manual upload trigger
  const triggerUpload = useCallback(
    (fileId?: string) => {
      const currentFiles = getCurrentFiles();
      const filesToUpload = fileId
        ? currentFiles.filter((f) => f.id === fileId && f.file)
        : currentFiles.filter(
            (f) =>
              f.file && !uploadStates.get(f.id)?.status?.includes("completed")
          );

      filesToUpload.forEach(handleFileUpload);
    },
    [getCurrentFiles, uploadStates, handleFileUpload]
  );

  /**
   * Handle file download action
   */
  const handleDownload = useCallback(
    (fileItem: FileItem) => {
      let fileUrl = fileItem.url;

      // Generate blob URL for File objects
      if (!fileUrl && fileItem.file) {
        fileUrl = FileUploadUtil.createBlobUrl(fileItem.file);
        blobUrls.current.add(fileUrl);
      }

      if (!fileUrl) {
        console.warn("No URL available for download:", fileItem.name);
        return;
      }

      // Use custom handler or default
      if (onDownload) {
        onDownload(fileItem, fileUrl);
      } else if (enableDefaultDownload) {
        FileUploadUtil.defaultDownload(fileItem, fileUrl);
      }
    },
    [onDownload, enableDefaultDownload]
  );

  /**
   * Handle file view action
   */
  const handleView = useCallback(
    (fileItem: FileItem) => {
      let fileUrl = fileItem.url;

      // Generate blob URL for File objects
      if (!fileUrl && fileItem.file) {
        fileUrl = FileUploadUtil.createBlobUrl(fileItem.file);
        blobUrls.current.add(fileUrl);
      }

      if (!fileUrl) {
        console.warn("No URL available for view:", fileItem.name);
        return;
      }

      // Use custom handler or default
      if (onView) {
        onView(fileItem, fileUrl);
      } else if (enableDefaultView) {
        FileUploadUtil.defaultView(fileItem, fileUrl);
      }
    },
    [onView, enableDefaultView]
  );

  /**
   * Handle file preview action
   */
  const handlePreview = useCallback(
    (fileItem: FileItem) => {
      let fileUrl = fileItem.url;

      if (!fileUrl && fileItem.file) {
        fileUrl = FileUploadUtil.createBlobUrl(fileItem.file);
        blobUrls.current.add(fileUrl);
      }

      if (!fileUrl) return;

      if (onPreview) {
        onPreview(fileItem, fileUrl);
      }
    },
    [onPreview]
  );

  /**
   * Determine which actions to show for a file
   */
  const getFileActions = useCallback(
    (fileItem: FileItem) => {
      const uploadState = uploadStates.get(fileItem.id);
      const isCompleted = uploadState?.status === "completed" || !!fileItem.url;
      const hasFile = !!fileItem.file;

      // No actions for pending/failed uploads without files
      if (!isCompleted && !hasFile) {
        return {
          showDownloadAction: false,
          showViewAction: false,
          showPreviewAction: false,
        };
      }

      const isPreviewable = FileUploadUtil.isPreviewable(fileItem);
      const primaryAction = FileUploadUtil.getPrimaryAction(fileItem);

      return {
        showDownloadAction: showDownload && (isCompleted || hasFile),
        showViewAction: showView && isPreviewable && (isCompleted || hasFile),
        showPreviewAction:
          showPreview && isPreviewable && (isCompleted || hasFile),
        primaryAction,
      };
    },
    [uploadStates, showDownload, showView, showPreview]
  );

  /**
   * Cleanup blob URLs on unmount
   */
  useEffect(() => {
    return () => {
      blobUrls.current.forEach((url) => {
        FileUploadUtil.revokeBlobUrl(url);
      });
      blobUrls.current.clear();
    };
  }, []);

  // ============= RENDER LOGIC =============

  const currentFiles = getCurrentFiles();
  const currentError = getCurrentError();
  const isTouched = isFieldTouched();

  const containerClasses = [
    "flex flex-col gap-1 w-full",
    className,
    disabled && "",
    // currentError && isTouched && styles.error,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} style={style}>
      {label && (
        <label
          className={cn(
            "text-sm font-medium",
            currentError && isTouched && "text-destructive",
            labelClassName
          )}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      {currentFiles.length === 0 ? (
        <BaseDropzone
          onDrop={handleFileDrop}
          helperText={placeholder}
          dropzoneOptions={{
            multiple,
            disabled,
            accept: accept
              ? accept.reduce((acc, type) => {
                  acc[type] = [];
                  return acc;
                }, {} as Record<string, string[]>)
              : undefined,
          }}
          containerStyle={{
            cursor: "pointer",
            padding: "1em 0.5em",
            border:
              currentError && isTouched
                ? ".0625rem solid var(--color-red-300)"
                : ".0625rem solid var(--color-gray-100)",
            borderRadius: ".25rem",
            ...containerStyle,
          }}
        />
      ) : (
        <div className={"flex flex-col gap-3 w-full"}>
          {currentFiles.map((fileItem) => {
            const uploadState = uploadStates.get(fileItem.id);
            const fileActions = getFileActions(fileItem);

            return (
              <FilePreview
                key={fileItem.id}
                file={fileItem}
                status={uploadState?.status}
                progress={showProgress ? uploadState?.progress : undefined}
                error={uploadState?.error}
                showProgress={showProgress}
                showFileSize={showFileSize}
                // Enhanced action props
                showDownload={fileActions.showDownloadAction}
                showView={fileActions.showViewAction}
                showPreview={fileActions.showPreviewAction}
                // Action handlers
                onDownload={() => handleDownload(fileItem)}
                onView={() => handleView(fileItem)}
                onPreview={() => handlePreview(fileItem)}
                onDelete={() => handleFileRemove(fileItem)}
                className={"fade-in"}
              />
            );
          })}

          {/* Add more files button */}
          {multiple && (!maxFiles || currentFiles.length < maxFiles) && (
            <BaseDropzone
              onDrop={handleFileDrop}
              helperText="Add more files"
              showCloudIcon={false}
              containerStyle={{
                cursor: "pointer",
                padding: "1em 0.5em",
                border: ".0625rem dashed var(--color-gray-300)",
                borderRadius: "6px",
              }}
            />
          )}
        </div>
      )}

      {/* Manual upload controls */}
      {!autoUpload && currentFiles.some((f) => f.file) && (
        <div
          className={
            "flex justify-start p-4 border border-dashed rounded-xl bg-sidebar"
          }
        >
          <Button
            type="button"
            onClick={() => triggerUpload()}
            disabled={disabled}
            variant={"primary"}
          >
            Upload All Files
          </Button>
        </div>
      )}

      {/* Error and helper text display */}
      {(isTouched && currentError) || helperText ? (
        <Typography
          size={"xs"}
          weight="regular"
          color={isTouched && currentError ? "error" : "secondary"}
          {...helperTextProps}
        >
          {isTouched && currentError ? currentError : helperText}
        </Typography>
      ) : null}
    </div>
  );
};

export default BaseFileUpload;
