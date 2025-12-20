"use client";
import React, { CSSProperties, ReactNode } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { CloudUploadIcon } from "lucide-react";
import Typography from "../ui/typography";

export type BaseDropzoneProps = {
  onDrop: (files: File[]) => void;
  label?: string;
  showCloudIcon?: boolean;
  helperText?: string;
  helperTextStyle?: CSSProperties;
  dropzoneOptions?: DropzoneOptions;
  previewContent?: ReactNode;
  error?: string;
  isTouched?: boolean;
  containerStyle?: CSSProperties;
};

const BaseDropzone = ({
  onDrop,
  label,
  showCloudIcon = true,
  helperText = `<p><span class=${"text-primary font-medium"}>Click to upload </span> or drag and drop </p> <p class="text-xs">SVG, PNG, JPG, or GIF (max. 800px x 400px)</p>`,
  helperTextStyle,
  dropzoneOptions,
  previewContent,
  error,
  isTouched,
  containerStyle,
}: BaseDropzoneProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    onDrop,
  });

  return (
    <div className={"flex flex-col gap-3"} style={containerStyle}>
      {label && <label className="label subtitle">{label}</label>}

      <section
        {...getRootProps({
          tabIndex: 0,
        })}
        className="focus:outline focus:outline-primary focus:outline-offset"
      >
        <input {...getInputProps()} aria-label={label || "Upload Files"} />

        {previewContent || (
          <div className={"flex flex-col items-center gap-2.5"}>
            {showCloudIcon && <CloudUploadIcon className="text-foreground" />}
            <Typography
              className={
                "text-center flex flex-col gap text-accent-foreground "
              }
              style={helperTextStyle}
              dangerouslySetInnerHTML={{ __html: helperText }}
              // dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(helperText)}}
            />
          </div>
        )}
      </section>

      {isTouched && error && <p className="baseInput-error-text">{error}</p>}
    </div>
  );
};

export default BaseDropzone;
