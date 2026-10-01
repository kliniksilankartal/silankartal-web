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

/**
 * İstemci tarafında büyük görselleri sıkıştırarak sunucuya hızlı ve sorunsuz yüklenmesini sağlar.
 */
async function compressImageIfNeeded(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // Dosya zaten küçükse (örneğin 500KB altı) sıkıştırmaya gerek yok
  if (file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        if (width <= maxWidth && height <= maxHeight && file.size < 1024 * 1024) {
          resolve(file);
          return;
        }

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
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
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Görsel boyutu en fazla 10MB olabilir.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadStatus('Görsel optimize ediliyor...');

    try {
      // 1. İstemci tarafında optimize et
      const optimizedFile = await compressImageIfNeeded(file);

      setUploadStatus('Görsel yükleniyor...');
      const formData = new FormData();
      formData.append('file', optimizedFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Yükleme başarısız oldu.');
      }

      if (data.url) {
        onImageUploaded(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Görsel yüklenirken bir sorun oluştu.');
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
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

  const isDataUri = Boolean(currentImage && currentImage.startsWith('data:'));

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
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
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
            unoptimized={isDataUri}
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
              <span className="text-xs font-bold">{uploadStatus || 'Görsel yükleniyor...'}</span>
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
              <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP (Otomatik Optimize Edilir)</span>
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
