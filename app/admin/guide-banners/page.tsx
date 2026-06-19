"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

type GuideBanner = {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
};

export default function AdminGuidePage() {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<GuideBanner[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    const q = query(collection(db, "guideBanners"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    setItems(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GuideBanner, "id">),
      }))
    );
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSave = async () => {
    if (!title || !order || !file) {
      alert("제목, 순서, 이미지를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `guideBanners/${fileName}`);

      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "guideBanners"), {
        title,
        order: Number(order),
        imageUrl,
        active: true,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setOrder("");
      setFile(null);
      await loadBanners();

      alert("저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제할까요?")) return;

    await deleteDoc(doc(db, "guideBanners", id));
    await loadBanners();
  };

  return (
    <div>
      <div className="max-w-5xl">
        <h1 className="mb-10 text-4xl font-bold">가이드 배너 관리</h1>

        <div className="mb-10 space-y-5 rounded-2xl border bg-white p-6">
          <div>
            <label className="mb-2 block font-semibold">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 기획가이드"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">노출 순서</label>
            <input
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="예: 1"
              type="number"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-8 py-4 font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-white p-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mb-4 aspect-square w-full rounded-xl bg-gray-100 object-contain"
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">{item.title}</p>
                  <p className="text-gray-500">순서: {item.order}</p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg border px-4 py-2 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}