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
import { db } from "@/lib/firebase";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
type Category = {
  id: string;
  name: string;
  order: number;
};

type PackageItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  moq: string;
  option: string;
  description: string;
  imageUrl: string;
  tags: string[];
  active: boolean;
};

export default function AdminPackagesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<PackageItem[]>([]);

  const [categoryName, setCategoryName] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [moq, setMoq] = useState("");
  const [option, setOption] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [active, setActive] = useState(true);

  const loadData = async () => {
    const categoryQuery = query(
      collection(db, "packageCategories"),
      orderBy("order", "asc")
    );

    const categorySnap = await getDocs(categoryQuery);

    const categoryList = categorySnap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Category, "id">),
    }));

    setCategories(categoryList);

    const itemSnap = await getDocs(collection(db, "packages"));

    const itemList = itemSnap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<PackageItem, "id">),
    }));

    setItems(itemList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "packageCategories"), {
      name: categoryName.trim(),
      order: categories.length + 1,
      createdAt: serverTimestamp(),
    });

    setCategoryName("");
    await loadData();
  };

  const deleteCategory = async (id: string) => {
    const ok = confirm("카테고리를 삭제할까요?");
    if (!ok) return;

    await deleteDoc(doc(db, "packageCategories", id));
    await loadData();
  };

  const addPackage = async () => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);

    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!name.trim()) {
      alert("패키지명을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "packages"), {
      categoryId,
      categoryName: selectedCategory.name,
      name,
      moq,
      option,
      description,
      imageUrl,
      detailImages,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      active,
      createdAt: serverTimestamp(),
    });

    setName("");
    setMoq("");
    setOption("");
    setDescription("");
    setImageUrl("");
    setDetailImages([]);
    setTags("");
    setActive(true);

    await loadData();
  };

  const deletePackage = async (id: string) => {
    const ok = confirm("패키지를 삭제할까요?");
    if (!ok) return;

    await deleteDoc(doc(db, "packages", id));
    await loadData();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="mb-8 text-3xl font-black">패키지 관리</h1>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black">카테고리 관리</h2>

          <div className="mb-5 flex gap-3">
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="예: 단상자, 라벨, 쇼핑백"
              className="flex-1 rounded-xl border px-4 py-3"
            />
            <button
              onClick={addCategory}
              className="rounded-xl bg-black px-6 py-3 font-bold text-white"
            >
              카테고리 추가
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-full border bg-white px-4 py-2"
              >
                <span className="font-bold">{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-sm font-bold text-red-500"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black">패키지 등록</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="패키지명"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              placeholder="MOQ 예: 3,000ea"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={option}
              onChange={(e) => setOption(e.target.value)}
              placeholder="옵션 예: 무광코팅 / 금박 / 부분UV"
              className="rounded-xl border px-4 py-3"
            />

            <ImageUploader
  folder="packages"
  value={imageUrl}
  onChange={setImageUrl}
/>
<MultiImageUploader
  folder="packages/detail"
  value={detailImages}
  onChange={setDetailImages}
/>

            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그 예: #단상자, #금박, #프리미엄"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="패키지 특징 설명"
              className="min-h-[120px] rounded-xl border px-4 py-3 md:col-span-2"
            />

            <label className="flex items-center gap-2 font-bold">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              홈페이지 노출
            </label>
          </div>

          <button
            onClick={addPackage}
            className="mt-6 rounded-xl bg-black px-8 py-3 font-bold text-white"
          >
            패키지 저장
          </button>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black">등록된 패키지</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border p-4">
                <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <p className="text-sm font-bold text-slate-500">
                  {item.categoryName}
                </p>

                <h3 className="mt-1 text-xl font-black">{item.name}</h3>

                <div className="mt-3 text-sm text-slate-600">
                  <p>MOQ {item.moq}</p>
                  <p>{item.option}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => deletePackage(item.id)}
                  className="mt-4 rounded-lg border border-red-400 px-4 py-2 text-sm font-bold text-red-500"
                >
                  삭제
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}