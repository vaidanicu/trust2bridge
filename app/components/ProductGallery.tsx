"use client";

import { useState } from "react";

export default function ProductGallery({ 
  mainImage, 
  gallery 
}: { 
  mainImage: string; 
  gallery: string[] 
}) {
  const [activeImage, setActiveImage] = useState(mainImage);
  const allImages = [mainImage, ...gallery].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Imaginea Principală */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {activeImage ? (
          <img
            src={activeImage}
            alt="Focus"
            className="h-[420px] w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400">
            Kein Bild
          </div>
        )}
      </div>

      {/* Galerie Miniaturi */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {allImages.map((imgUrl, index) => (
            <div 
              key={index} 
              className={`aspect-square overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                activeImage === imgUrl ? "border-[#108280]" : "border-transparent hover:border-slate-300"
              }`}
              onClick={() => setActiveImage(imgUrl)}
            >
              <img src={imgUrl} alt={`Thumb ${index}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}