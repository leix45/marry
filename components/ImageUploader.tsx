import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  onClear: () => void;
  selectedImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onClear, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelect(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group">
        <img 
          src={selectedImage} 
          alt="Selected" 
          className="w-full h-full object-contain"
        />
        <button 
          onClick={onClear}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
          title="Remove image"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full aspect-square md:aspect-video rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8
        ${isDragging 
          ? 'border-christmas-red bg-red-50 scale-[0.99]' 
          : 'border-slate-300 hover:border-christmas-red/50 hover:bg-slate-50'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-red-100 text-christmas-red' : 'bg-slate-100 text-slate-500'}`}>
        <Upload size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-1 text-center">
        Upload your photo
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Drag & drop or click to browse. <br/>Supports JPG, PNG, WEBP.
      </p>
    </div>
  );
};