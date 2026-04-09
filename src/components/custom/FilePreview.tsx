import React, { CSSProperties } from "react";
import { StringUtil } from "@/utilities/stringUtil";
import {
  CheckCircleIcon as SuccessFilledTickIcon,
  DownloadIcon,
  RotateCw as RefreshIcon,
  CircleX,
  EyeIcon,
  SquareArrowOutUpRight,
  Trash as TrashIcon,
} from "lucide-react";
import { FormUtil } from "@/utilities/formUtil";
import { Progress } from "../ui/progress";
import Typography from "../ui/typography";
import { FileUploadUtil } from "@/utilities/fileUploadUtil";
import { FileItem, FileUploadState } from "./BaseFileUpload";
import FileFormatsIcon, { FileFormatTypes } from "../icons/FileFormatsIcon";
import { cn } from "@/lib/utils"; // Assuming you have a class merger, if not, standard template literals work
import { Button as BaseButton } from "../ui/button";

export interface FilePreviewProps {
  // Core data
  file: File | string | FileItem;

  // Upload state
  status?: FileUploadState["status"];
  progress?: number;
  error?: string;

  // action controls
  showDownload?: boolean;
  showView?: boolean;
  showPreview?: boolean;
  showDelete?: boolean;

  // Action handlers
  onDelete?: () => void;
  onDownload?: () => void;
  onView?: () => void;
  onPreview?: () => void;
  onRetry?: () => void;

  // Display options
  showProgress?: boolean;
  showFileSize?: boolean;

  // Styling
  statusStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  status,
  progress = 0,
  error,
  showProgress = true,
  showFileSize = true,
  showDownload = true,
  showView = true,
  showPreview = false,
  showDelete = true,
  onDelete,
  onDownload,
  onView,
  onPreview,
  onRetry,
  statusStyle,
  containerStyle,
  className = "",
}) => {
  // Extract file information
  const fileInfo = React.useMemo(() => {
    if (file instanceof File) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: undefined,
        extension: file?.name?.slice(file.name.lastIndexOf(".") + 1),
        file: file,
      };
    }

    if (typeof file === "string") {
      const name = StringUtil.convertToSentenceCase(
        file.slice(file.lastIndexOf("/") + 1)
      );
      const extension = file?.slice(file.lastIndexOf(".") + 1);
      return {
        name,
        size: undefined,
        type: undefined,
        url: file,
        extension,
        file: undefined,
      };
    }

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url,
      extension: file.name?.slice(file.name.lastIndexOf(".") + 1),
      file: file.file,
    };
  }, [file]);

  // Determine file format for icon
  const fileFormat = React.useMemo(() => {
    if (fileInfo.type) {
      return fileInfo.type.split("/")[1];
    }
    if (fileInfo.extension) {
      return fileInfo.extension.replace(".", "");
    }
    return "unknown";
  }, [fileInfo]);

  // Status configuration mapping to Tailwind classes
  const statusConfig = React.useMemo(() => {
    if (!status) {
      return {
        containerClass: "bg-card border-border hover:border-primary/50",
        textClass: "text-muted-foreground",
        icon: null,
      };
    }

    switch (status) {
      case "pending":
        return {
          containerClass: "bg-warning/10 border-warning/20",
          textClass: "text-warning-dark dark:text-warning",
          icon: null,
        };
      case "uploading":
        return {
          containerClass: "bg-primary/10 border-primary/20",
          textClass: "text-primary",
          icon: null,
        };
      case "completed":
        return {
          containerClass: "bg-success/10 border-success/20",
          textClass: "text-success",
          icon: <SuccessFilledTickIcon className="text-success" />,
        };
      case "failed":
        return {
          containerClass: "bg-destructive/10 border-destructive/20",
          textClass: "text-destructive",
          icon: <CircleX className="text-destructive" />,
        };
      case "cancelled":
        return {
          containerClass: "bg-muted/50 border-muted opacity-70",
          textClass: "text-muted-foreground",
          icon: null,
        };
      default:
        return {
          containerClass: "bg-card border-border",
          textClass: "text-muted-foreground",
          icon: null,
        };
    }
  }, [status]);

  // Action buttons configuration
  const actionButtons = React.useMemo(() => {
    const buttons = [];

    if (FileUploadUtil.isPreviewable(fileInfo) && onView && showView) {
      buttons.push({
        key: "view",
        icon: <EyeIcon className="text-foreground" />,
        onClick: onView,
        title: "View file",
        disabled: false,
      });
    }

    if (
      showDownload &&
      onDownload &&
      (fileInfo.url || status === "completed" || fileInfo.file)
    ) {
      buttons.push({
        key: "download",
        icon: <DownloadIcon className="text-foreground" />,
        onClick: onDownload,
        title: "Download file",
        disabled: false,
      });
    }

    if (showPreview && onPreview && FileUploadUtil.isPreviewable(fileInfo)) {
      buttons.push({
        key: "preview",
        icon: <SquareArrowOutUpRight className="text-foreground" />,
        onClick: onPreview,
        title: "Preview",
        disabled: false,
      });
    }

    if (status === "failed" && onRetry) {
      buttons.push({
        key: "retry",
        icon: <RefreshIcon className="text-foreground" />,
        onClick: onRetry,
        title: "Retry upload",
        disabled: false,
      });
    }

    if (showDelete && onDelete) {
      const shouldShow =
        !status ||
        status === "pending" ||
        status === "failed" ||
        status === "cancelled" ||
        status === "completed";

      if (shouldShow) {
        buttons.push({
          key: "delete",
          icon: <TrashIcon className="text-foreground" />,
          onClick: onDelete,
          title: "Remove file",
          isDestructive: true,
        });
      }
    }

    return buttons;
  }, [
    showDownload,
    showView,
    showPreview,
    showDelete,
    onDownload,
    onView,
    onPreview,
    onDelete,
    onRetry,
    status,
    fileInfo,
  ]);

  const statusText = React.useMemo(() => {
    switch (status) {
      case "pending":
        return "Pending upload";
      case "uploading":
        return `Uploading... ${progress}%`;
      case "completed":
        return "Upload complete";
      case "failed":
        return error || "Upload failed";
      case "cancelled":
        return "Upload cancelled";
      default:
        return null;
    }
  }, [status, progress, error]);

  return (
    <div
      className={`flex flex-col rounded-lg transition-all duration-200 overflow-hidden hover:-translate-y-[1px] hover:shadow-sm ${className}`}
      style={containerStyle}
    >
      <div
        className={`
          flex items-start gap-3 p-3 sm:p-4 border rounded-lg transition-colors duration-200
          ${statusConfig.containerClass}
        `}
      >
        {/* File Format Icon Wrapper */}
        <div className="shrink-0 flex items-center justify-center rounded-md bg-muted/50 w-9 h-9 sm:w-10 sm:h-10">
          <FileFormatsIcon fileFormatType={fileFormat as FileFormatTypes} />
        </div>

        {/* File information */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <Typography
              weight="medium"
              className="text-sm font-medium text-foreground truncate leading-tight"
              title={fileInfo.name}
            >
              {fileInfo.name}
            </Typography>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-wrap">
              {/* File size */}
              {showFileSize && fileInfo.size && (
                <Typography className="text-xs text-muted-foreground font-normal">
                  {FormUtil.getFileSizeInText(fileInfo.size)}
                </Typography>
              )}

              {/* Status text */}
              {statusText && (
                <Typography
                  className={`text-xs font-medium leading-none ${statusConfig.textClass}`}
                  style={statusStyle}
                >
                  {statusText}
                </Typography>
              )}
            </div>

            {/* Progress bar */}
            {showProgress && status === "uploading" && (
              <div className="mt-2 w-full">
                <Progress value={progress} max={100} className="h-1.5" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto mt-1 sm:mt-0 w-full sm:w-auto justify-end">
            {/* Status icon */}
            {statusConfig.icon && (
              <div className="flex items-center justify-center w-5 h-5 [&>svg]:w-4 [&>svg]:h-4">
                {statusConfig.icon}
              </div>
            )}

            {actionButtons.map((button) => (
              <BaseButton
                startIcon={button.icon}
                key={button.key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!button.disabled) {
                    button.onClick();
                  }
                }}
                title={button.title}
                disabled={button.disabled}
                className={`
                  flex items-center justify-center rounded-md bg-transparent
                  transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus:outline-none cursor-pointer
                  w-7 h-7 sm:w-8 sm:h-8
                  ${
                    button.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  }
                  ${
                    button.isDestructive && !button.disabled
                      ? "hover:text-destructive hover:bg-destructive/10"
                      : ""
                  }
                `}
              ></BaseButton>
            ))}
          </div>
        </div>
      </div>

      {/* Error message footer */}
      {status === "failed" && error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 border-t-0 rounded-b-lg">
          <Typography className="text-xs text-destructive m-0">
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
