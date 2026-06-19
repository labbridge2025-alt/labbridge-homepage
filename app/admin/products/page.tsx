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
    if (tags.includes(tag)) {
      setTags(tags.filter((item) => item !== tag));
    } else {
      setTags([...tags, tag]);
    }
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
    <main className="min-h-screen bg-[#f4f6f8] flex">
      <aside className="w-64 bg-[#0f172a] text-white p-6 hidden lg:flex flex-col">
        <h1 className="text-xl font-bold">LABBRIDGE</h1>
        <p className="text-xs text-gray-400 mb-10">ADMIN</p>

        <nav className="space-y-2 flex-1">
          {[
            ["대시보드", "/admin"],
            ["문의 관리", "/admin/inquiries"],
            ["가이드 배너", "/admin/guide"],
            ["포트폴리오", "/admin/portfolio"],
            ["팝업 관리", "/admin/popup"],
            ["상품 관리", "/admin/products"],
          ].map(([menuName, href]) => (
            <a
              key={menuName}
              href={href}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold ${
                href === "/admin/products"
                  ? "bg-blue-600"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              {menuName}
            </a>
          ))}
        </nav>

        <a
          href="/"
          className="border border-white/20 rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/10"
        >
          사이트 이동 →
        </a>
      </aside>

      <section className="flex-1 p-6 lg:p-10">
        <h1 className="text-4xl font-bold mb-8">상품 관리</h1>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-8">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "상품 수정" : "상품 등록"}
            </h2>

            <label className="block font-bold mb-2">상품명</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 가지클레이 팩클렌저"
            />

            <label className="block font-bold mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
            >
              {categoryOptions.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <label className="block font-bold mb-2">MOQ</label>
            <input
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 3000"
            />

            <label className="block font-bold mb-2">소비자 g당 단가</label>
            <input
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 52"
            />

            <label className="block font-bold mb-2">내부 g당 원가</label>
            <input
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 38"
            />

            <label className="block font-bold mb-2">제품 태그</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                    tags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <label className="block font-bold mb-2">제조사명</label>
            <input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 동방코스메틱"
            />

            <label className="block font-bold mb-2">랩넘버</label>
            <input
              value={labNumber}
              onChange={(e) => setLabNumber(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: LB-2405-001"
            />

            <label className="block font-bold mb-2">담당자</label>
            <input
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 김민지"
            />

            <label className="block font-bold mb-2">담당자 연락처</label>
            <input
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-5"
              placeholder="예: 010-0000-0000"
            />

            <label className="block font-bold mb-2">상품 이미지</label>
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

            <button
              type="button"
              onClick={saveProduct}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
            >
              {editingId ? "수정 저장" : "저장"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="mt-3 w-full border py-4 rounded-xl font-bold"
              >
                수정 취소
              </button>
            )}
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">등록된 상품</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              {["전체", ...categoryOptions].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilterCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-bold ${
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
                  className="flex items-center justify-between border rounded-xl p-4 gap-4"
                >
                  <div className="flex gap-4 items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border"
                      />
                    )}

                    <div>
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-gray-500 text-sm">MOQ {item.moq}</p>
                      <p className="text-gray-500 text-sm">
                        소비자 단가 {item.unitPrice}원
                      </p>
                      <p className="text-gray-400 text-sm">
                        내부 원가 {item.costPrice}원
                      </p>
                      <p className="text-gray-400 text-sm">
                        제조사 {item.manufacturer || "-"} / 랩넘버{" "}
                        {item.labNumber || "-"}
                      </p>

                      {item.tags?.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {item.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs border rounded-full px-2 py-1 text-blue-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      수정
                    </button>

                    <a
                      href={`/admin/products/${item.id}`}
                      className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                      상세관리
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteProduct(item.id)}
                      className="px-4 py-2 border rounded-lg text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}

              {pagedItems.length === 0 && (
                <div className="border rounded-xl p-10 text-center text-gray-500">
                  등록된 상품이 없습니다.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-40"
                >
                  이전
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 border rounded-lg ${
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
                  className="px-4 py-2 border rounded-lg disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}