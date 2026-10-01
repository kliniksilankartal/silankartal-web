'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTrash, FaSpinner } from 'react-icons/fa';

interface ImageUploadZoneProps {
  label: string;
  description?: string;
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  aspectRatio?: 'video' | 'landscape' | 'square' | 'portrait' | 'auto';
}

export default function ImageUploadZone({
  label,
  description,
  currentImage,
  onImageUploaded,
  onImageRemoved,
  aspectRatio = 'auto',
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Görsel boyutu en fazla 5MB olabilir.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Yükleme başarısız');
      }

      if (data.url) {
        onImageUploaded(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Görsel yüklenirken bir sorun oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === 'video' || aspectRatio === 'landscape'
      ? 'aspect-video'
      : aspectRatio === 'portrait'
      ? 'aspect-3/4'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'h-48 sm:h-56';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {currentImage && onImageRemoved && (
          <button
            type="button"
            onClick={onImageRemoved}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold transition-colors"
          >
            <FaTrash size={10} /> Görseli Kaldır
          </button>
        )}
      </div>

      {description && <p className="text-xs text-slate-500">{description}</p>}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {currentImage ? (
        <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs`}>
          <Image
            src={currentImage}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-2xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md hover:bg-slate-50 transition-all cursor-pointer"
            >
              Görseli Değiştir
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${aspectClass} rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            isDragging
              ? 'border-teal-600 bg-teal-50/60 scale-[0.99]'
              : 'border-slate-300 hover:border-teal-500 bg-slate-50/60 hover:bg-teal-50/20'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-teal-700">
              <FaSpinner className="animate-spin" size={24} />
              <span className="text-xs font-bold">Görsel yükleniyor...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
                <FaCloudUploadAlt size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Fotoğrafı buraya sürükleyip bırakın
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  veya cihazınızdan dosya seçmek için <span className="text-teal-700 font-semibold underline">tıklayın</span>
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP (Maks. 5MB)</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
