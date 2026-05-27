import React from 'react';

export default function Skeleton({ className = "", variant = "rectangular" }) {
  // variant bisa 'rectangular' (kotak), 'circular' (lingkaran), atau 'text' (untuk baris teks)
  const baseClasses = "bg-white/10 animate-pulse";
  
  let variantClasses = "";
  if (variant === "circular") {
    variantClasses = "rounded-full";
  } else if (variant === "text") {
    variantClasses = "rounded-md h-4 w-full"; // Default text line
  } else {
    variantClasses = "rounded-xl"; // Default rectangular shape
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}></div>
  );
}

// Komponen Card Skeleton siap pakai untuk Card (seperti VideoCard atau ProgramCard)
export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex flex-col gap-4">
      {/* Gambar Thumbnail Skeleton */}
      <Skeleton className="w-full h-40" />
      
      <div className="flex flex-col gap-2">
        {/* Title Skeleton */}
        <Skeleton variant="text" className="w-3/4 h-5" />
        {/* Subtitle / Desc Skeleton */}
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>

      <div className="flex justify-between items-center mt-2">
        {/* Badge Skeleton */}
        <Skeleton className="w-16 h-6 rounded-full" />
        {/* Action Button Skeleton */}
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}
