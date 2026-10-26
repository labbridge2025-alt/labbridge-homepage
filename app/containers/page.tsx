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
const [searchTerm, setSearchTerm] = useState("");
const [selectedVolume, setSelectedVolume] = useState("전체");

const volumeOptions = [
  "전체",
  "5ml",
  "10ml",
  "15ml",
  "20ml",
  "30ml",
  "50ml",
  "80ml",
  "100ml",
  "120ml",
  "150ml",
  "200ml",
  "250ml",
  "300ml",
  "500ml",
  "기타",
];
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

const normalizeVolume = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/㎖/g, "ml");

const standardVolumes = volumeOptions.filter(
  (volume) => volume !== "전체" && volume !== "기타"
);

const filteredItems = items.filter((item) => {
  const categoryMatch =
    filterCategory === "전체" ||
    item.categoryName === filterCategory;

  const tagMatch =
    filterTag === "전체" ||
    item.tags?.includes(`#${filterTag}`) ||
    item.tags?.includes(filterTag);

  const keyword = searchTerm.trim().toLowerCase();

  const searchMatch =
    keyword === "" ||
    [
      item.name,
      item.categoryName,
      item.volume,
      item.material,
      item.print,
      item.description,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ]
      .filter((value) => typeof value === "string")
      .some((value) => value.toLowerCase().includes(keyword));

  const volume = normalizeVolume(item.volume);

  const volumeMatch =
    selectedVolume === "전체" ||
    (selectedVolume === "기타"
      ? !standardVolumes.some(
          (option) => normalizeVolume(option) === volume
        )
      : volume === normalizeVolume(selectedVolume));

  return categoryMatch && tagMatch && searchMatch && volumeMatch;
});

const resetFilters = () => {
  setSearchTerm("");
  setSelectedVolume("전체");
  setFilterCategory("전체");
  setFilterTag("전체");
};

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
{/* 검색 및 용량 필터 */}
<div className="mb-8 lg:mb-10">

  {/* 검색창 */}
  <div className="relative w-full max-w-2xl mb-6">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>

    <input
      type="search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="용기명, 용량, 재질, 종류를 검색해보세요."
      aria-label="용기 검색"
      className="w-full h-14 pl-14 pr-12 border border-gray-300 rounded-xl bg-white text-sm sm:text-base outline-none focus:border-black focus:ring-1 focus:ring-black transition"
    />

    {searchTerm && (
      <button
        type="button"
        onClick={() => setSearchTerm("")}
        aria-label="검색어 지우기"
        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xl"
      >
        ×
      </button>
    )}
  </div>

  {/* 용량 선택 */}
  <div className="mb-5">
    <p className="text-sm font-bold mb-3">
      용량 선택
    </p>

    <div className="flex flex-wrap gap-2">
      {volumeOptions.map((volume) => (
        <button
          key={volume}
          type="button"
          onClick={() => setSelectedVolume(volume)}
          className={`px-4 py-2 rounded-xl border text-sm font-bold transition ${
            selectedVolume === volume
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 hover:border-black"
          }`}
        >
          {volume}
        </button>
      ))}
    </div>
  </div>

  {/* 검색 결과 및 초기화 */}
  <div className="flex items-center justify-between gap-4">
    <p className="text-sm text-gray-500">
      총{" "}
      <span className="font-bold text-black">
        {filteredItems.length}
      </span>
      개의 용기
    </p>

    <button
      type="button"
      onClick={resetFilters}
      className="text-sm text-gray-500 hover:text-black underline underline-offset-4"
    >
      필터 초기화
    </button>
  </div>
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
                {searchTerm.trim() ||
selectedVolume !== "전체" ||
filterCategory !== "전체" ||
filterTag !== "전체"
  ? "선택하신 조건에 맞는 용기가 없습니다. 다른 검색어나 용량을 선택해보세요."
  : "등록된 용기가 없습니다."}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}