"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BaseImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallback?: React.ReactNode;
  onLoadComplete?: () => void;
}

export function BaseImage({
  src,
  alt,
  className,
  containerClassName,
  fallback,
  onLoadComplete,
}: BaseImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={cn("relative", containerClassName)}>
      {isLoading && !hasError && (
        <Skeleton
          className={cn(
            "absolute inset-0 w-full h-full bg-muted-foreground",
            className
          )}
        />
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500 ease-out",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
