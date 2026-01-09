"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BaseImage } from "@/components/custom/BaseImage";
import { ExternalLink, Image } from "lucide-react";
import {
  DiscountBadge,
  DiscountBadgeProps,
  FeaturedBadge,
} from "./status-badge";

interface ImageGalleryProps {
  images: string[];
  title: string;
  isFeatured?: boolean;
  discountPercentage?: number;
  discountBadgeProps?: Omit<DiscountBadgeProps, "percentage">;
  className?: string;
}

export function ImageGallery({
  images,
  title,
  isFeatured = false,
  discountPercentage = 0,
  discountBadgeProps,
  className,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted ">
        {images[selectedImage] ? (
          <BaseImage
            src={images[selectedImage]}
            alt={title}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full "
            onLoadComplete={() => handleImageLoad(selectedImage)}
            fallback={
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                <ExternalLink className="h-16 w-16" />
              </div>
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
            <Image className="h-16 w-16" />
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between animate-fade-in">
          <div className="flex flex-col gap-2">
            {isFeatured && <FeaturedBadge />}
          </div>
          {discountPercentage > 0 && (
            <DiscountBadge
              percentage={discountPercentage}
              className="text-base px-3 py-1"
              {...discountBadgeProps}
            />
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 pb-2 animate-slide-up flex-wrap">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition-all duration-300",
                selectedImage === index
                  ? "border-primary scale-105"
                  : "border-transparent hover:border-muted hover:scale-110"
              )}
            >
              <BaseImage
                src={img}
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
                onLoadComplete={() => handleImageLoad(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
