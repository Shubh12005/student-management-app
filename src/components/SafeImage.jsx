import React, { useState } from "react";
import { User, Image as ImageIcon } from "lucide-react";

export default function SafeImage({
  src,
  alt = "Image",
  className = "",
  fallbackText = "",
  fallbackType = "user",
}) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    if (fallbackText) {
      const initials = fallbackText
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return (
        <div
          className={`flex items-center justify-center font-bold uppercase select-none ${className}`}
          style={{ backgroundColor: "#EDE5D5", color: "#8C6A31" }}
        >
          {initials}
        </div>
      );
    }
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ backgroundColor: "#EDE5D5", color: "#8C6A31" }}
      >
        {fallbackType === "user" ? <User size={20} /> : <ImageIcon size={20} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}
