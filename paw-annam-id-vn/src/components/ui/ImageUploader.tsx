"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type ImageUploaderProps = {
  petId: string;
  albums: { id: string; name: string }[];
  onUploadSuccess: () => void;
};

type UploadingFile = {
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
};

export default function ImageUploader({ petId, albums, onUploadSuccess }: ImageUploaderProps) {
  const tCommon = useTranslations("common");
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.map((file) => ({
      file,
      progress: 0,
      status: "idle" as const,
    }));
    setUploadingFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const triggerUpload = async () => {
    const filesToUpload = uploadingFiles.filter((f) => f.status === "idle");
    if (filesToUpload.length === 0) return;

    // Set files to uploading status
    setUploadingFiles((prev) =>
      prev.map((f) => (f.status === "idle" ? { ...f, status: "uploading" } : f))
    );

    for (let i = 0; i < uploadingFiles.length; i++) {
      const item = uploadingFiles[i];
      if (item.status !== "idle") continue;

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("petId", petId);
      formData.append("albumId", selectedAlbum);
      formData.append("isFavorite", "false");

      try {
        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error || "Không thể tải lên.");
        }

        // Update status to success
        setUploadingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "success", progress: 100 } : f))
        );
      } catch (err: any) {
        setUploadingFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "error", error: err.message } : f))
        );
      }
    }

    onUploadSuccess();
  };

  const clearCompleted = () => {
    setUploadingFiles((prev) => prev.filter((f) => f.status !== "success"));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Target Album Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <h3 className="font-bold text-text text-base">Tải ảnh/video mới lên</h3>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-text-secondary">Chọn Album:</label>
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="bg-surface-alt border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
          >
            <option value="">Không có (Ảnh chung)</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
          dragActive
            ? "border-primary bg-primary-light/30"
            : "border-border hover:border-primary/50 hover:bg-surface-alt/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="w-10 h-10 text-primary mb-3" />
        <p className="text-sm font-semibold text-text">Kéo thả file ảnh/video vào đây</p>
        <p className="text-xs text-text-muted mt-1">Hoặc click để duyệt file từ máy tính</p>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
            <span>Danh sách file ({uploadingFiles.length})</span>
            <button onClick={clearCompleted} className="text-primary hover:underline">
              Xóa các file hoàn thành
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {uploadingFiles.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-border/50 rounded-xl text-xs bg-surface-alt/10"
              >
                <div className="flex-1 min-w-0 pr-4 space-y-1">
                  <span className="font-semibold text-text block truncate">{item.file.name}</span>
                  <span className="text-[10px] text-text-muted block">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {item.status === "uploading" && (
                    <div className="flex items-center gap-1.5 text-primary">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải lên...</span>
                    </div>
                  )}

                  {item.status === "success" && (
                    <div className="flex items-center gap-1 text-secondary font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Xong</span>
                    </div>
                  )}

                  {item.status === "error" && (
                    <div className="flex items-center gap-1 text-red-500 font-medium" title={item.error}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Lỗi</span>
                    </div>
                  )}

                  {item.status === "idle" && (
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1 text-text-muted hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setUploadingFiles([])}
              className="px-4 py-2 border border-border hover:bg-surface-alt text-text-secondary font-semibold rounded-xl text-xs transition-colors"
            >
              Hủy tất cả
            </button>
            <button
              onClick={triggerUpload}
              className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-5 py-2 text-xs transition-colors shadow-sm"
            >
              Tải lên server
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
