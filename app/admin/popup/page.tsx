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

type PopupItem = {
  id: string;
  imageUrl: string;
  link: string;
  page: string;
  active: boolean;
};

export default function PopupAdminPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("/estimate");
  const [page, setPage] = useState("/");
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [items, setItems] = useState<PopupItem[]>([]);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(false);

  const pageOptions = [
    { label: "메인", value: "/" },
    { label: "회사소개", value: "/about" },
    { label: "상품", value: "/products" },
    { label: "진행절차", value: "/process" },
    { label: "포트폴리오", value: "/portfolio" },
    { label: "문의하기", value: "/estimate" },
    { label: "전체 페이지", value: "all" },
  ];

  const loadPopups = async () => {
    const q = query(collection(db, "popups"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    setItems(
      snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<PopupItem, "id">),
      }))
    );
  };

  useEffect(() => {
    loadPopups();
  }, []);

  const resetForm = () => {
    setImageUrl("");
    setLink("/estimate");
    setPage("/");
    setActive(true);
    setFile(null);
    setPreview("");
    setEditingId("");
  };

  const savePopup = async () => {
    if (!file && !imageUrl) {
      alert("팝업 이미지를 등록해주세요.");
      return;
    }

    try {
      setLoading(true);

      let finalImageUrl = imageUrl;

      if (file) {
        const fileRef = ref(storage, `popups/${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        finalImageUrl = await getDownloadURL(fileRef);
      }

      const data = {
        imageUrl: finalImageUrl,
        link,
        page,
        active,
      };

      if (editingId) {
        await updateDoc(doc(db, "popups", editingId), {
          ...data,
          updatedAt: serverTimestamp(),
        });

        alert("팝업이 수정되었습니다.");
      } else {
        await addDoc(collection(db, "popups"), {
          ...data,
          createdAt: serverTimestamp(),
        });

        alert("팝업이 저장되었습니다.");
      }

      resetForm();
      await loadPopups();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: PopupItem) => {
    setEditingId(item.id);
    setImageUrl(item.imageUrl);
    setPreview(item.imageUrl);
    setLink(item.link || "/estimate");
    setPage(item.page || "/");
    setActive(item.active ?? true);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePopup = async (id: string) => {
    if (!confirm("팝업을 삭제할까요?")) return;

    await deleteDoc(doc(db, "popups", id));
    await loadPopups();
  };

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">팝업 관리</h1>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">
            {editingId ? "팝업 수정" : "팝업 등록"}
          </h2>

          <label className="mb-2 block font-bold">팝업 이미지</label>

          <label className="mb-6 flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="팝업 미리보기"
                className="h-full w-full object-contain"
              />
            ) : (
              <>
                <span className="mb-2 text-4xl">＋</span>
                <span className="font-bold">이미지 업로드</span>
                <span className="mt-2 text-sm text-gray-500">
                  PNG, JPG 파일 선택
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);

                if (selectedFile) {
                  setPreview(URL.createObjectURL(selectedFile));
                }
              }}
            />
          </label>

          <div className="mb-6">
            <label className="mb-2 block font-bold">이동 링크</label>

            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
              placeholder="/estimate"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-bold">노출 페이지</label>

            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              {pageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3 font-bold">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              팝업 사용
            </label>
          </div>

          <button
            onClick={savePopup}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white disabled:bg-gray-400"
          >
            {loading ? "저장 중..." : editingId ? "수정 저장" : "저장"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="mt-3 w-full rounded-xl border px-6 py-4 font-bold"
            >
              수정 취소
            </button>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">등록된 팝업</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border p-4">
                <img
                  src={item.imageUrl}
                  alt="팝업"
                  className="mb-4 h-56 w-full rounded-xl bg-gray-100 object-contain"
                />

                <p className="text-sm">
                  <b>노출 페이지:</b> {item.page}
                </p>
                <p className="text-sm">
                  <b>이동 링크:</b> {item.link}
                </p>
                <p className="mb-4 text-sm">
                  <b>상태:</b> {item.active ? "사용 중" : "미사용"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg border px-4 py-2"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => deletePopup(item.id)}
                    className="rounded-lg border px-4 py-2 text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="rounded-xl border p-10 text-center text-gray-500">
                등록된 팝업이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}