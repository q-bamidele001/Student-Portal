"use client";

import { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Avatar } from "./Avatar";

interface ImageUploadProps {
  currentImage?: string | null;
  firstName: string;
  lastName: string;
  onImageChange: (base64: string | null) => void;
  theme?: "light" | "dark";
}

export const ImageUpload = ({
  currentImage,
  firstName,
  lastName,
  onImageChange,
  theme = "dark",
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateAndProcessImage = async (file: File) => {
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setPreview(base64);
      onImageChange(base64);
    } catch (err) {
      setError("Failed to process image");
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await validateAndProcessImage(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await validateAndProcessImage(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label
        className={`block text-sm font-medium px-5 mb-2 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Profile Picture
      </label>

      <div className="flex items-center gap-6">
        {/* Avatar Preview */}
        <Avatar
          src={preview}
          firstName={firstName || "Student"}
          lastName={lastName || ""}
          size="xl"
          theme={theme}
        />

        {/* Upload Area */}
        <div className="flex-1">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? theme === "dark"
                  ? "border-emerald-400 bg-emerald-400/10"
                  : "border-emerald-600 bg-emerald-50"
                : theme === "dark"
                ? "border-gray-700 hover:border-gray-600 bg-gray-900/50"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p
              className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              PNG, JPG, GIF up to 2MB
            </p>
          </div>

          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`mt-3 text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-700"
              }`}
            >
              Remove Image
            </button>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};