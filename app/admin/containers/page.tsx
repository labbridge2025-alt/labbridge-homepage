"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
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

type Category = {
  id: string;
  name: string;
  order: number;
};

type ContainerItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  volume: string;
  moq: string;
  material: string;
  print: string;
  description: string;
  imageUrl: string;
  detailImages: string[];
  recommendProducts: string[];
  tags: string[];
  active: boolean;
};

type ProductItem = {
  id: string;
  name: string;
  category?: string;
};

export default function AdminContainersPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ContainerItem[]>([]);

  const [categoryName, setCategoryName] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [moq, setMoq] = useState("");
  const [material, setMaterial] = useState("");
  const [print, setPrint] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [active, setActive] = useState(true);
  const [products, setProducts] = useState<ProductItem[]>([]);
const [recommendProducts, setRecommendProducts] = useState<string[]>([]);
  const loadData = async () => {
    const categoryQuery = query(
      collection(db, "containerCategories"),
      orderBy("order", "asc")
    );

    const categorySnap = await getDocs(categoryQuery);

    const categoryList = categorySnap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Category, "id">),
    }));

    setCategories(categoryList);

    const itemSnap = await getDocs(collection(db, "containers"));

    const itemList = itemSnap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<ContainerItem, "id">),
    }));

    setItems(itemList);
    const productSnap = await getDocs(collection(db, "products"));

const productList = productSnap.docs.map((docItem) => ({
  id: docItem.id,
  ...(docItem.data() as Omit<ProductItem, "id">),
}));

setProducts(productList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "containerCategories"), {
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

    await deleteDoc(doc(db, "containerCategories", id));
    await loadData();
  };

  const addContainer = async () => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);

    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!name.trim()) {
      alert("용기명을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "containers"), {
      categoryId,
      categoryName: selectedCategory.name,
      name,
      volume,
      moq,
      material,
      print,
      description,
      imageUrl,
detailImages,
recommendProducts,
tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      active,
      createdAt: serverTimestamp(),
    });

    setName("");
    setVolume("");
    setMoq("");
    setMaterial("");
    setPrint("");
    setDescription("");
    setImageUrl("");
    setDetailImages([]);
    setRecommendProducts([]);
    setTags("");
    setActive(true);

    await loadData();
  };

  const deleteContainer = async (id: string) => {
    const ok = confirm("용기를 삭제할까요?");
    if (!ok) return;

    await deleteDoc(doc(db, "containers", id));
    await loadData();
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="mb-8 text-3xl font-black">용기 관리</h1>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black">카테고리 관리</h2>

          <div className="mb-5 flex gap-3">
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="예: 튜브, 에어리스, 크림자"
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
          <h2 className="mb-4 text-xl font-black">용기 등록</h2>

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
              placeholder="용기명"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="용량 예: 50ml"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              placeholder="MOQ 예: 3,000ea"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="재질 예: PP / PET"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={print}
              onChange={(e) => setPrint(e.target.value)}
              placeholder="인쇄방법 예: 실크인쇄 가능"
              className="rounded-xl border px-4 py-3"
            />
<ImageUploader
  folder="containers"
  value={imageUrl}
  onChange={setImageUrl}
/>
<MultiImageUploader
  folder="containers/detail"
  value={detailImages}
  onChange={setDetailImages}
/>
<div className="rounded-2xl border p-5 md:col-span-2">
  <h3 className="mb-4 text-lg font-black">추천 제형 선택</h3>

  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
    {products.map((product) => {
      const checked = recommendProducts.includes(product.id);

      return (
        <label
          key={product.id}
          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 ${
            checked
              ? "border-black bg-black text-white"
              : "border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              setRecommendProducts((prev) =>
                prev.includes(product.id)
                  ? prev.filter((id) => id !== product.id)
                  : [...prev, product.id]
              );
            }}
          />

          <span>
            {product.category && `[${product.category}] `}
            {product.name}
          </span>
        </label>
      );
    })}
  </div>
</div>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그 예: #튜브, #크림, #클렌저"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="용기 특징 설명"
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
            onClick={addContainer}
            className="mt-6 rounded-xl bg-black px-8 py-3 font-bold text-white"
          >
            용기 저장
          </button>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-black">등록된 용기</h2>

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
                  <p>용량 {item.volume}</p>
                  <p>MOQ {item.moq}</p>
                  <p>재질 {item.material}</p>
                  <p>{item.print}</p>
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

                <div className="mt-4 flex gap-2">
<button
  onClick={() => deleteContainer(item.id)}
  className="mt-4 rounded-lg border border-red-400 px-4 py-2 text-sm font-bold text-red-500"
>
  삭제
</button>
</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}