"use client";

import { useState } from "react";

export default function PopupAdminPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("/estimate");
  const [active, setActive] = useState(true);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          팝업 관리
        </h1>

        <div className="bg-white rounded-2xl border p-8">
          <div className="mb-6">
            <label className="font-bold block mb-2">
              팝업 이미지 URL
            </label>

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="https://..."
            />
          </div>

          <div className="mb-6">
            <label className="font-bold block mb-2">
              이동 링크
            </label>

            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />

              팝업 사용
            </label>
          </div>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
            저장
          </button>
        </div>
      </div>
    </main>
  );
}