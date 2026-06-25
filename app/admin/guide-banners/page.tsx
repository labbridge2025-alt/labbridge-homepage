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
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

type GuideBanner = {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
};

export default function AdminGuidePage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const resetForm = () => {
    setEditingId(null);
    setTag("");
    setTitle("");
    setDescription("");
    setOrder("");
    setFile(null);

    const fileInput = document.getElementById(
      "guide-file"
    ) as HTMLInputElement | null;

    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (item: GuideBanner) => {
    setEditingId(item.id);
    setTag(item.tag || "");
    setTitle(item.title || "");
    setDescription(item.description || "");
    setOrder(String(item.order || ""));
    setFile(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!tag || !title || !order) {
      alert("해시태그, 제목, 순서를 입력해주세요.");
      return;
    }

    if (!editingId && !file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);

      const saveData: {
        tag: string;
        title: string;
        description: string;
        order: number;
        active: boolean;
        updatedAt: any;
        imageUrl?: string;
      } = {
        tag,
        title,
        description,
        order: Number(order),
        active: true,
        updatedAt: serverTimestamp(),
      };

      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `guideBanners/${fileName}`);

        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        saveData.imageUrl = imageUrl;
      }

      if (editingId) {
        await updateDoc(doc(db, "guideBanners", editingId), saveData);
      } else {
        await addDoc(collection(db, "guideBanners"), {
          ...saveData,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
      await loadBanners();

      alert(editingId ? "수정되었습니다." : "저장되었습니다.");
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
        <h1 className="mb-3 text-4xl font-bold">브랜드 런칭 가이드</h1>
        <p className="mb-10 text-gray-500">
          메인 화면의 #제형개발, #제품출시, #소량런칭 이미지와 문구를
          관리합니다.
        </p>

        <div className="mb-10 space-y-5 rounded-2xl border bg-white p-6">
          {editingId && (
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-blue-600">
              수정 모드입니다. 이미지를 새로 선택하지 않으면 기존 이미지가
              유지됩니다.
            </div>
          )}

          <div>
            <label className="mb-2 block font-semibold">해시태그</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="예: #제형개발"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 맞춤 제형 개발"
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 브랜드 컨셉에 맞는 제형을 기획하고 개발합니다."
              rows={3}
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
              id="guide-file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-xl bg-black px-8 py-4 font-semibold text-white disabled:bg-gray-400"
            >
              {loading
                ? "저장 중..."
                : editingId
                ? "수정 저장하기"
                : "저장하기"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-xl border px-8 py-4 font-semibold"
              >
                취소
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border bg-white p-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mb-4 aspect-square w-full rounded-xl bg-gray-100 object-contain"
              />

              <div className="space-y-1">
                <p className="text-sm text-gray-500">순서: {item.order}</p>
                <p className="font-semibold">{item.tag}</p>
                <p className="text-xl font-bold">{item.title}</p>

                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  수정
                </button>

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