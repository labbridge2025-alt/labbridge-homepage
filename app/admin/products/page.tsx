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

export default function ProductsAdminPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("스킨케어");
  const [moq, setMoq] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [labNumber, setLabNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [filterCategory, setFilterCategory] = useState("전체");
  const [items, setItems] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const [editingId, setEditingId] = useState("");
  const [editingImage, setEditingImage] = useState("");

  const tagOptions = [
    "진정",
    "수분",
    "보습",
    "미백",
    "모공",
    "탄력",
    "주름개선",
    "피지케어",
    "각질케어",
    "장벽강화",
    "트러블",
    "영양",
    "광채",
  ];

  const categoryOptions = [
    "스킨케어",
    "토너",
    "에센스",
    "앰플",
    "크림",
    "클렌저",
    "마스크팩",
    "헤어",
    "바디",
    "색조",
    "기타",
  ];

  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    setItems(
      snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
    );
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };

  const resetForm = () => {
    setName("");
    setCategory("스킨케어");
    setMoq("");
    setUnitPrice("");
    setCostPrice("");
    setManufacturer("");
    setLabNumber("");
    setManagerName("");
    setManagerPhone("");
    setTags([]);
    setFile(null);
    setPreview("");
    setEditingId("");
    setEditingImage("");
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || "");
    setCategory(item.category || "스킨케어");
    setMoq(item.moq || "");
    setUnitPrice(item.unitPrice || "");
    setCostPrice(item.costPrice || "");
    setManufacturer(item.manufacturer || "");
    setLabNumber(item.labNumber || "");
    setManagerName(item.managerName || "");
    setManagerPhone(item.managerPhone || "");
    setTags(item.tags || []);
    setEditingImage(item.image || "");
    setPreview(item.image || "");
    setFile(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await deleteDoc(doc(db, "products", id));
    alert("삭제되었습니다.");
    loadProducts();
  };

  const saveProduct = async () => {
    if (!name) {
      alert("상품명을 입력해주세요.");
      return;
    }

    let imageUrl = editingImage;

    if (file) {
      const fileRef = ref(storage, `products/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    const data = {
      name,
      category,
      moq,
      unitPrice,
      costPrice,
      manufacturer,
      labNumber,
      managerName,
      managerPhone,
      tags,
      image: imageUrl,
    };

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), {
        ...data,
        updatedAt: serverTimestamp(),
      });

      alert("상품이 수정되었습니다.");
    } else {
      await addDoc(collection(db, "products"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      alert("상품이 등록되었습니다.");
    }

    resetForm();
    loadProducts();
  };

  const filteredItems =
    filterCategory === "전체"
      ? items
      : items.filter((item) => item.category === filterCategory);

  const totalPages = Math.ceil(filteredItems.length / perPage);

  const pagedItems = filteredItems.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">상품 관리</h1>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">
            {editingId ? "상품 수정" : "상품 등록"}
          </h2>

          <label className="mb-2 block font-bold">상품명</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 가지클레이 팩클렌저"
          />

          <label className="mb-2 block font-bold">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
          >
            {categoryOptions.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <label className="mb-2 block font-bold">MOQ</label>
          <input
            value={moq}
            onChange={(e) => setMoq(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 3000"
          />

          <label className="mb-2 block font-bold">소비자 g당 단가</label>
          <input
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 52"
          />

          <label className="mb-2 block font-bold">내부 g당 원가</label>
          <input
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 38"
          />

          <label className="mb-2 block font-bold">제품 태그</label>
          <div className="mb-5 flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-lg border px-4 py-2 text-sm font-bold ${
                  tags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <label className="mb-2 block font-bold">제조사명</label>
          <input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 동방코스메틱"
          />

          <label className="mb-2 block font-bold">랩넘버</label>
          <input
            value={labNumber}
            onChange={(e) => setLabNumber(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: LB-2405-001"
          />

          <label className="mb-2 block font-bold">담당자</label>
          <input
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 김민지"
          />

          <label className="mb-2 block font-bold">담당자 연락처</label>
          <input
            value={managerPhone}
            onChange={(e) => setManagerPhone(e.target.value)}
            className="mb-5 w-full rounded-xl border px-4 py-3"
            placeholder="예: 010-0000-0000"
          />

          <label className="mb-2 block font-bold">상품 이미지</label>
          <label className="mb-6 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="미리보기"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <>
                <span className="mb-2 text-3xl">＋</span>
                <span className="font-bold">이미지 업로드</span>
                <span className="mt-2 text-sm text-gray-500">
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

          <button
            type="button"
            onClick={saveProduct}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-3 w-full rounded-xl border py-4 font-bold"
            >
              수정 취소
            </button>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">등록된 상품</h2>

          <div className="mb-6 flex flex-wrap gap-2">
            {["전체", ...categoryOptions].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFilterCategory(cat);
                  setCurrentPage(1);
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-bold ${
                  filterCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {pagedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border p-4"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl border object-cover"
                    />
                  )}

                  <div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-sm text-gray-500">MOQ {item.moq}</p>
                    <p className="text-sm text-gray-500">
                      소비자 단가 {item.unitPrice}원
                    </p>
                    <p className="text-sm text-gray-400">
                      내부 원가 {item.costPrice}원
                    </p>
                    <p className="text-sm text-gray-400">
                      제조사 {item.manufacturer || "-"} / 랩넘버{" "}
                      {item.labNumber || "-"}
                    </p>

                    {item.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-full border px-2 py-1 text-xs text-blue-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg border px-4 py-2"
                  >
                    수정
                  </button>

                  <a
                    href={`/admin/products/${item.id}`}
                    className="rounded-lg bg-black px-4 py-2 text-white"
                  >
                    상세관리
                  </a>

                  <button
                    type="button"
                    onClick={() => deleteProduct(item.id)}
                    className="rounded-lg border px-4 py-2 text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {pagedItems.length === 0 && (
              <div className="rounded-xl border p-10 text-center text-gray-500">
                등록된 상품이 없습니다.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                이전
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`rounded-lg border px-4 py-2 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}