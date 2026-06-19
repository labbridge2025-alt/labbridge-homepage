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

export default function PortfolioAdminPage() {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
const [editingId, setEditingId] = useState("");
const [editingImage, setEditingImage] = useState("");
  const loadPortfolio = async () => {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    setItems(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    loadPortfolio();
  }, []);
  
const deletePortfolio = async (id: string) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  await deleteDoc(doc(db, "portfolio", id));

  alert("삭제되었습니다.");
  loadPortfolio();
};
const startEdit = (item: any) => {
  setEditingId(item.id);
  setBrand(item.brand || "");
  setProduct(item.product || "");
  setDescription(item.description || "");
  setEditingImage(item.image || "");
  setPreview(item.image || "");
  setFile(null);

  window.scrollTo({ top: 0, behavior: "smooth" });
};
const savePortfolio = async () => {
  if (!brand || !product) {
    alert("브랜드명과 제품명을 입력해주세요.");
    return;
  }

  let imageUrl = editingImage;

  if (file) {
    const fileRef = ref(
      storage,
      `portfolio/${Date.now()}-${file.name}`
    );

    await uploadBytes(fileRef, file);
    imageUrl = await getDownloadURL(fileRef);
  }

  if (editingId) {
    await updateDoc(doc(db, "portfolio", editingId), {
      brand,
      product,
      description,
      image: imageUrl,
      updatedAt: serverTimestamp(),
    });

    alert("포트폴리오가 수정되었습니다.");
  } else {
    await addDoc(collection(db, "portfolio"), {
      brand,
      product,
      description,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });

    alert("포트폴리오가 저장되었습니다.");
  }

  setBrand("");
  setProduct("");
  setDescription("");
  setFile(null);
  setPreview("");
  setEditingId("");
  setEditingImage("");

  loadPortfolio();
};

  return (
    <main className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-[#0f1b2d] text-white p-6">
        <h1 className="text-2xl font-bold mb-1">LABBRIDGE</h1>
        <p className="text-sm text-gray-400 mb-10">ADMIN</p>

        <nav className="space-y-2">
          <a href="/admin" className="block px-5 py-4 rounded-xl text-gray-300 hover:bg-white/10">
            대시보드
          </a>
          <a href="/admin/inquiries" className="block px-5 py-4 rounded-xl text-gray-300 hover:bg-white/10">
            문의 관리
          </a>
          <a href="/admin/portfolio" className="block px-5 py-4 rounded-xl bg-blue-600 text-white font-bold">
            포트폴리오 관리
          </a>
        </nav>
      </aside>

      <section className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-8">포트폴리오 관리</h1>

        <div className="grid grid-cols-[1fr_1.2fr] gap-8">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">포트폴리오 등록</h2>

            <label className="block font-bold mb-2">브랜드명</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: REBALAN"
            />

            <label className="block font-bold mb-2">제품명</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 아이백 크림"
            />

            <label className="block font-bold mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 h-32 mb-6"
              placeholder="제품 설명을 입력해주세요"
            />

        <label className="block font-bold mb-2">포트폴리오 이미지</label>

<label className="mb-6 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
  {preview ? (
  <img
    src={preview}
    alt="미리보기"
    className="w-full h-full object-cover rounded-2xl"
  />
) : (
  <>
    <span className="text-3xl mb-2">＋</span>
    <span className="font-bold">이미지 업로드</span>
    <span className="text-sm text-gray-500 mt-2">
      PNG, JPG 파일 선택
    </span>
  </>
)}
 <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  }}
  className="hidden"
/>
</label>

{file && (
  <p className="mb-6 text-sm text-blue-600">
    선택된 파일: {file.name}
  </p>
)}

            <button
              type="button"
              onClick={savePortfolio}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
            >
              {editingId ? "수정 저장" : "저장"}
            </button>
            {editingId && (
  <button
    type="button"
    onClick={() => {
      setBrand("");
      setProduct("");
      setDescription("");
      setFile(null);
      setPreview("");
      setEditingId("");
      setEditingImage("");
    }}
    className="mt-3 w-full border py-4 rounded-xl font-bold"
  >
    수정 취소
  </button>
)}
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">등록된 포트폴리오</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-xl p-4"
                >
                  <div className="flex gap-4 items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.product}
                        className="w-20 h-20 object-cover rounded-xl border"
                      />
                    )}

                    <div>
                      <h3 className="text-xl font-bold">{item.brand}</h3>
                      <p>{item.product}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
  type="button"
  onClick={() => startEdit(item)}
  className="px-4 py-2 border rounded-lg"
>
  수정
</button>
                    <button
  type="button"
  onClick={() => deletePortfolio(item.id)}
  className="px-4 py-2 border rounded-lg text-red-500"
>
  삭제
</button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="border rounded-xl p-10 text-center text-gray-500">
                  등록된 포트폴리오가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}