import { FileItem } from "@/components/custom/BaseFileUpload";
import * as yup from "yup";

/**
 * File action handlers - for download, view, and preview functionality
 */
export interface FileActionHandlers {
  onDownload?: (fileItem: FileItem, fileUrl: string) => void;
  onView?: (fileItem: FileItem, fileUrl: string) => void;
  onPreview?: (fileItem: FileItem, fileUrl: string) => void;
}

export class FileUploadUtil {
  /**
   * Generate unique file ID
   * DRY principle: Centralized ID generation
   */
  static generateFileId = (): string => {
    return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  /**
   * Create FileItem from File object
   * Factory pattern: Consistent file item creation
   */
  static createFileItemFromFile = (file: File, id?: string): FileItem => ({
    id: id || this.generateFileId(),
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  });

  /**
   * Create FileItem from URL (for existing files)
   * Factory pattern: Consistent file item creation
   */
  static createFileItemFromUrl = (
    url: string,
    name: string,
    id?: string,
    metadata?: Record<string, unknown>
  ): FileItem => ({
    id: id || this.generateFileId(),
    name,
    url,
    metadata,
  });

  /**
   * Check if file type is previewable in browser
   */
  static isPreviewable(fileItem: Omit<FileItem, "id">): boolean {
    if (!fileItem.type && !fileItem.name) return false;

    const mimeType = fileItem.type?.toLowerCase() || "";
    const extension = fileItem.name.split(".").pop()?.toLowerCase() || "";

    const previewableTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Documents
      "application/pdf",
      "text/plain",
      "text/html",
      "text/csv",
      // Videos (basic support)
      "video/mp4",
      "video/webm",
    ];

    const previewableExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "pdf",
      "txt",
      "html",
      "csv",
      "mp4",
      "webm",
    ];

    return (
      previewableTypes.includes(mimeType) ||
      previewableExtensions.includes(extension)
    );
  }

  /**
   * Get appropriate file action (view vs download)
   */
  static getPrimaryAction(fileItem: FileItem): "view" | "download" {
    return this.isPreviewable(fileItem) ? "view" : "download";
  }

  /**
   * Default download implementation
   */
  static defaultDownload = (fileItem: FileItem, fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileItem.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Default view implementation
   */
  static defaultView = (fileItem: FileItem, fileUrl: string) => {
    // Open in new tab for preview
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  /**
   * Generate blob URL for File objects
   */
  static createBlobUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Cleanup blob URLs to prevent memory leaks
   */
  static revokeBlobUrl(url: string) {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  static baseFileValidation(min: number, max: number) {
    return yup
      .array()
      .min(min, "Please upload a profile image")
      .max(max, "Please upload a profile image")
      .required();
  }
}
