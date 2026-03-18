"use client";

import Image from "next/image";
import { useState } from "react";

interface RetailerLogoProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function RetailerLogo({ src, alt = "", size = 36, className = "", fallback }: RetailerLogoProps) {
  const [error, setError] = useState(false);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
