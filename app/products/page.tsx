"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterTag, setFilterTag] = useState("전체");

  const tagOptions = [
    "전체",
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
    "전체",
    "스킨케어",
    "클렌저",
    "헤어",
    "바디",
    "색조",
    "기타",
  ];

  useEffect(() => {
    const loadProducts = async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      setItems(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    loadProducts();

    const saved = localStorage.getItem("labbridge-wish");
    if (saved) {
      setWish(JSON.parse(saved));
    }
  }, []);

  const toggleWish = (id: string) => {
    let next: string[];

    if (wish.includes(id)) {
      next = wish.filter((itemId) => itemId !== id);
    } else {
      next = [...wish, id];
    }

    setWish(next);
    localStorage.setItem("labbridge-wish", JSON.stringify(next));
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      filterCategory === "전체" || item.category === filterCategory;

    const tagMatch =
      filterTag === "전체" || item.tags?.includes(filterTag);

    return categoryMatch && tagMatch;
  });

  return (
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-10 lg:mb-12">
          <div>
            <p className="text-gray-500 font-semibold mb-3 lg:mb-4">
              PRODUCTS
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
              제품 라인업
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              다양한 제형과 컨셉의 OEM · ODM 제품을 확인해보세요.
            </p>
          </div>

          <a
            href="/wish"
            className="w-full sm:w-fit border rounded-xl px-6 py-3 font-bold hover:bg-gray-50 text-center whitespace-nowrap"
          >
            관심장바구니 {wish.length}개
          </a>
        </div>

        {/* 모바일 필터바 */}
<div className="flex lg:hidden gap-2 overflow-x-auto pb-3 mb-8">
  <button className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold">
    스킨케어 전체 ▾
  </button>

  <button className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold">
    제형 ▾
  </button>

  <button className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold">
    효능 ▾
  </button>

  <button className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold">
    샘플가능
  </button>
</div>

{/* PC 태그 필터 */}
<div className="hidden lg:flex gap-2 mb-10 overflow-x-auto pb-2">
  {tagOptions.map((tag) => (
    <button
      key={tag}
      type="button"
      onClick={() => setFilterTag(tag)}
      className={`shrink-0 px-4 py-2 rounded-xl border text-sm font-bold ${
        filterTag === tag
          ? "bg-black text-white"
          : "bg-white text-gray-600"
      }`}
    >
      {tag === "전체" ? "전체" : `#${tag}`}
    </button>
  ))}
</div>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] xl:grid-cols-[220px_1fr] gap-8 lg:gap-16">
          <aside className="hidden lg:block">
            <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-8">
              → 제형
            </h3>

            <nav className="flex lg:block gap-2 overflow-x-auto pb-2 lg:pb-0 lg:space-y-5 text-base lg:text-lg">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`shrink-0 px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none border lg:border-0 text-left ${
                    filterCategory === cat
                      ? "font-bold bg-black text-white lg:bg-transparent lg:text-black lg:underline lg:underline-offset-4"
                      : "text-gray-500 bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {filteredItems.map((item) => {
              const isWish = wish.includes(item.id);

              return (
                <a
                  href={`/products/${item.id}`}
                  key={item.id}
                  className="relative border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition block"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWish(item.id);
                    }}
                    className="absolute top-4 right-4 z-10 text-3xl transition-all hover:scale-125"
                  >
                    <span className={isWish ? "text-red-500" : "text-white"}>
                      ♥
                    </span>
                  </button>

                  <div className="h-[180px] sm:h-[240px] lg:h-[280px] bg-gray-100">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4 lg:p-6">
  <p className="text-xs lg:text-sm text-gray-500 mb-2">
    {item.category}
  </p>

  <h2 className="text-base lg:text-xl font-bold leading-snug line-clamp-2">
    {item.name}
  </h2>

  <div className="hidden lg:block mt-3">
    <p className="text-gray-600 text-sm">MOQ {item.moq}</p>
    <p className="text-gray-600 text-sm">
      g당 단가 {item.unitPrice}원
    </p>

    {item.tags?.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {item.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
</div>
</a>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="sm:col-span-2 xl:col-span-3 border rounded-2xl p-12 lg:p-20 text-center text-gray-500">
                등록된 제품이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}