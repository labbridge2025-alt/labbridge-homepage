"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ContainerItem = {
  id: string;
  categoryId?: string;
  categoryName: string;
  name: string;
  volume: string;
  moq: string;
  material: string;
  print: string;
  description: string;
  imageUrl: string;
  tags: string[];
  active: boolean;
};

export default function ContainersPage() {
  const [items, setItems] = useState<ContainerItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterTag, setFilterTag] = useState("전체");
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [mobileTagOpen, setMobileTagOpen] = useState(false);

  const tagOptions = [
    "전체",
    "튜브",
    "에어리스",
    "펌프",
    "드로퍼",
    "자",
    "쿠션",
    "미스트",
    "립",
  ];

  const categoryOptions = [
    "전체",
    "튜브",
    "에어리스",
    "펌프",
    "드로퍼",
    "자",
    "쿠션",
    "미스트",
    "립",
    "기타",
  ];

  useEffect(() => {
    const loadContainers = async () => {
      const q = query(collection(db, "containers"), where("active", "==", true));
      const snap = await getDocs(q);

      setItems(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ContainerItem, "id">),
        }))
      );
    };

    loadContainers();
  }, []);

  const filteredItems = items.filter((item) => {
    const categoryMatch =
      filterCategory === "전체" || item.categoryName === filterCategory;

    const tagMatch =
      filterTag === "전체" || item.tags?.includes(`#${filterTag}`) || item.tags?.includes(filterTag);

    return categoryMatch && tagMatch;
  });

  return (
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 mb-10 lg:mb-12">
          <div>
            <p className="text-gray-500 font-semibold mb-3">CONTAINERS</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              용기 라인업
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              브랜드 컨셉에 맞는 다양한 화장품 용기를 확인해보세요.
            </p>
          </div>

          <a
            href="/estimate"
            className="w-full sm:w-fit border rounded-xl px-6 py-3 font-bold hover:bg-gray-50 text-center whitespace-nowrap"
          >
            제조 문의하기
          </a>
        </div>

        {/* 모바일 필터 */}
        <div className="lg:hidden mb-8">
          <div className="flex gap-2 overflow-x-auto pb-3">
            <button
              type="button"
              onClick={() => {
                setMobileCategoryOpen(!mobileCategoryOpen);
                setMobileTagOpen(false);
              }}
              className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold"
            >
              {filterCategory === "전체" ? "용기 전체" : filterCategory} ▾
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileTagOpen(!mobileTagOpen);
                setMobileCategoryOpen(false);
              }}
              className="shrink-0 border rounded-lg px-4 py-3 text-sm font-bold"
            >
              형태 ▾
            </button>
          </div>

          {mobileCategoryOpen && (
            <div className="border rounded-2xl p-4 mt-2 bg-white">
              <p className="font-bold mb-3">용기 선택</p>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFilterCategory(cat);
                      setMobileCategoryOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      filterCategory === cat
                        ? "bg-black text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mobileTagOpen && (
            <div className="border rounded-2xl p-4 mt-2 bg-white">
              <p className="font-bold mb-3">태그 선택</p>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFilterTag(tag);
                      setMobileTagOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      filterTag === tag
                        ? "bg-black text-white"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {tag === "전체" ? "전체" : `#${tag}`}
                  </button>
                ))}
              </div>
            </div>
          )}
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
          {/* PC 카테고리 */}
          <aside className="hidden lg:block">
            <h3 className="text-xl font-bold mb-8">→ 용기</h3>

            <nav className="space-y-5 text-lg">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`block w-full text-left ${
                    filterCategory === cat
                      ? "font-bold underline underline-offset-4 text-black"
                      : "text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          {/* 용기 카드 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {filteredItems.map((item) => (
  <a
    href={`/containers/${item.id}`}
    key={item.id}
    className="relative border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition block"
  >
                <div className="h-[180px] sm:h-[240px] lg:h-[280px] bg-gray-100">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4 lg:p-6">
                  <p className="text-xs lg:text-sm text-gray-500 mb-2">
                    {item.categoryName}
                  </p>

                  <h2 className="text-base lg:text-xl font-bold leading-snug line-clamp-2">
                    {item.name}
                  </h2>

                  <div className="hidden lg:block mt-3">
                    <p className="text-gray-600 text-sm">용량 {item.volume}</p>
                    <p className="text-gray-600 text-sm">MOQ {item.moq}</p>
                    <p className="text-gray-600 text-sm">재질 {item.material}</p>
                    <p className="text-gray-600 text-sm">{item.print}</p>

                    {item.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {item.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                          >
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-2 lg:col-span-3 border rounded-2xl p-12 lg:p-20 text-center text-gray-500">
                등록된 용기가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}