"use client"

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, Loader2, CheckCircle2 } from 'lucide-react';
import { mediaService } from '@/lib/api/media';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string; // The current image URL
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, label = "Image", className = "" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5 Mo).");
      return;
    }

    setIsUploading(true);
    try {
      const response = await mediaService.uploadImage(file);
      if (response && response.url) {
        onChange(response.url); // Send the Cloudinary URL back to the parent form
        toast.success("Image téléchargée avec succès");
      }
    } catch (error) {
      toast.error("Échec de l'upload de l'image");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      
      <div className="relative group">
        <div className={`w-full h-40 rounded-xl bg-slate-50 border-2 ${value ? 'border-solid border-slate-200' : 'border-dashed border-slate-300'} flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500`}>
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-slate-900 p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  title="Changer d'image"
                >
                  <Camera size={18} />
                </button>
                <button 
                  type="button"
                  onClick={handleRemove}
                  className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Supprimer l'image"
                >
                  <X size={18} />
                </button>
              </div>
            </>
          ) : (
            <div 
              className="text-center p-4 text-slate-400 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 size={32} className="mx-auto text-emerald-500 mb-2 animate-spin" />
              ) : (
                <UploadCloud size={32} className="mx-auto text-slate-300 mb-2 group-hover:text-emerald-500 transition-colors" />
              )}
              <span className="text-xs font-medium uppercase tracking-wider block mt-2">
                {isUploading ? "Upload en cours..." : "Cliquez pour Uploader"}
              </span>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isUploading}
        />
      </div>
      
      {/* Optionnel : champs texte classique pour fallback */}
      <div className="flex gap-2 items-center pt-2">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou collez une URL directe d'image ici..."
          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {value && <CheckCircle2 size={16} className="text-emerald-500" />}
      </div>
    </div>
  );
}
