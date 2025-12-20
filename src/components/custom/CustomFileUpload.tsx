"use client";

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface FileItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  file?: File;
}

export type FileUploadHandler = (
  file: File,
  fileId: string,
  onProgress?: (progress: number) => void,
  onStatusChange?: (
    status: "pending" | "uploading" | "completed" | "failed" | "cancelled",
    error?: string
  ) => void,
  generateUploadUrl?: (args: { fileName: string }) => Promise<any>
) => Promise<{ url?: string; metadata?: unknown }>;

export interface BaseFileUploadProps {
  files?: FileItem[];
  onChange?: (files: FileItem[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string[];
  uploadHandler?: FileUploadHandler;
  showPreview?: boolean;
  label?: string;
  helperText?: string;
}

function makeId() {
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function BaseFileUpload({
  files = [],
  onChange,
  multiple = true,
  maxFiles,
  accept,
  uploadHandler,
  showPreview = true,
  label,
  helperText,
}: BaseFileUploadProps) {
  const [localFiles, setLocalFiles] = useState<FileItem[]>(files || []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLocalFiles(files || []);
  }, [files]);

  const toAcceptAttr = accept ? accept.join(",") : undefined;

  const handleFiles = useCallback(
    async (fileList: File[]) => {
      let next = [...localFiles];
      for (const f of fileList) {
        if (maxFiles && next.length >= maxFiles) break;
        const id = makeId();
        const url = URL.createObjectURL(f);
        next.push({
          id,
          name: f.name,
          size: f.size,
          type: f.type,
          url,
          file: f,
        });
      }
      setLocalFiles(next);
      onChange?.(next);
    },
    [localFiles, maxFiles, onChange]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fl = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(fl);
      e.currentTarget.value = ""; // reset
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      const next = localFiles.filter((f) => f.id !== id);
      setLocalFiles(next);
      onChange?.(next);
    },
    [localFiles, onChange]
  );

  const replaceFile = useCallback(
    (id: string, file: File) => {
      const url = URL.createObjectURL(file);
      const next = localFiles.map((f) =>
        f.id === id ? { ...f, file, url, name: file.name, size: file.size } : f
      );
      setLocalFiles(next);
      onChange?.(next);
    },
    [localFiles, onChange]
  );

  const uploadAll = useCallback(async () => {
    if (!uploadHandler) return localFiles;
    const uploaded: FileItem[] = [];
    for (const f of localFiles) {
      if (f.file) {
        try {
          const res = await uploadHandler(
            f.file,
            f.id,
            (p) => {
              /* optional progress callback - no-op for now */
            },
            (s, e) => {
              /* optional status callback - no-op for now */
            }
          );
          uploaded.push({ ...f, url: res?.url ?? f.url });
        } catch (err) {
          uploaded.push(f);
        }
      } else {
        uploaded.push(f);
      }
    }
    setLocalFiles(uploaded);
    onChange?.(uploaded);
    return uploaded;
  }, [localFiles, uploadHandler, onChange]);

  useEffect(() => {
    return () => {
      localFiles.forEach((f) => {
        if (f.url?.startsWith("blob:")) URL.revokeObjectURL(f.url);
      });
    };
  }, [localFiles]);

  return (
    <div>
      {label && <div className="text-sm font-medium mb-2">{label}</div>}
      <div className="border rounded p-3">
        <div className="flex gap-3 items-center">
          <Button
            type="button"
            size="small"
            onClick={() => inputRef.current?.click()}
            variant="secondary"
          >
            Select all Files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={toAcceptAttr}
            multiple={multiple}
            onChange={(e) => onInputChange(e as ChangeEvent<HTMLInputElement>)}
            className="hidden"
          />
          {helperText && (
            <div className="text-sm text-gray-500">{helperText}</div>
          )}
        </div>

        {showPreview && localFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {localFiles.map((f) => (
              <div
                key={f.id}
                className="relative border rounded overflow-hidden"
              >
                {f.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.url}
                    alt={f.name}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-50 flex items-center justify-center">
                    No preview
                  </div>
                )}
                <div className="absolute top-1 right-1 flex gap-1">
                  <Button
                    size="small"
                    onClick={() => removeFile(f.id)}
                    variant="ghost"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex gap-2 justify-end">
          {uploadHandler && (
            <Button size="small" onClick={uploadAll}>
              Upload
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
