"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

type Props = {
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
};

export default function MultiImageUploader({
  folder,
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    const urls: string[] = [...value];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    onChange(urls);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border rounded-xl px-5 py-3 font-bold"
      >
        {uploading ? "업로드 중..." : "상세이미지 선택"}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept="image/*"
        onChange={uploadImages}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {value.map((url, index) => (
          <div key={url} className="relative">
            <img
              src={url}
              className="w-full aspect-square rounded-xl object-cover border"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}