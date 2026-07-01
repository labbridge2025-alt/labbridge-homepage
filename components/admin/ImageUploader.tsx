"use client";

import { useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

type ImageUploaderProps = {
  folder: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({
  folder,
  value,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      return;
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    setProgress(0);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      () => {
        alert("이미지 업로드 중 오류가 발생했어요.");
        setUploading(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        onChange(downloadUrl);
        setUploading(false);
      }
    );
  };

  const removeImage = async () => {
    if (!value) return;

    const ok = confirm("이미지를 삭제할까요?");
    if (!ok) return;

    try {
      await deleteObject(ref(storage, value));
    } catch {
      // Storage 이미지가 아니면 삭제 실패할 수 있어서 무시
    }

    onChange("");
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 md:col-span-2">
      <p className="mb-3 text-sm font-black text-slate-700">이미지 업로드</p>

      {value ? (
        <div>
          <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-white">
            <img
              src={value}
              alt="업로드 이미지"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex gap-2">
            <label className="cursor-pointer rounded-xl bg-black px-5 py-3 text-sm font-bold text-white">
              사진 변경
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
              />
            </label>

            <button
              type="button"
              onClick={removeImage}
              className="rounded-xl border border-red-400 px-5 py-3 text-sm font-bold text-red-500"
            >
              사진 삭제
            </button>
          </div>
        </div>
      ) : (
        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl bg-white text-center">
          <span className="text-4xl">📷</span>
          <span className="mt-3 font-bold">사진을 선택해주세요</span>
          <span className="mt-1 text-sm text-slate-500">
            JPG, PNG, WEBP 가능
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
        </label>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-sm font-bold">
            <span>업로드중...</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-black" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}