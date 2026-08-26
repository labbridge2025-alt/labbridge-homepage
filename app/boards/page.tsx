"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const categories = [
  "전체",
  "원료자료",
  "가이드라인",
  "트렌드자료",
  "공지사항",
  "FAQ",
  "기타",
];

export default function BoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const q = query(
          collection(db, "boards"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((board: any) => board.isPublished === true);

        setBoards(list);
      } catch (error) {
        console.error("게시글 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, []);

  const filteredBoards = useMemo(() => {
    if (selectedCategory === "전체") {
      return boards;
    }

    return boards.filter(
      (board) => board.category === selectedCategory
    );
  }, [boards, selectedCategory]);

  const getThumbnail = (board: any) => {
    // 관리자에서 대표 이미지 필드를 따로 저장한 경우
    if (board.thumbnailUrl) {
      return board.thumbnailUrl;
    }

    // slides 배열을 사용하는 게시물
    if (
      Array.isArray(board.slides) &&
      board.slides.length > 0 &&
      board.slides[0]?.imageUrl
    ) {
      return board.slides[0].imageUrl;
    }

    // 기존 HTML content 안에서 첫 번째 이미지 추출
    if (
      typeof board.content === "string" &&
      board.content.includes("<img")
    ) {
      const match = board.content.match(
        /<img[^>]+src=["']([^"']+)["']/i
      );

      if (match?.[1]) {
        return match[1];
      }
    }

    return null;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-gray-400">
            콘텐츠를 불러오는 중입니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-28 pt-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8">

        {/* 상단 타이틀 */}
        <section className="mb-12 border-b border-black pb-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-gray-400">
            LABBRIDGE CONTENT
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            LAB MEMBERS
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-500 md:text-base">
            화장품 제조에 필요한 원료, 제형, 용기, 패키지,
            트렌드와 실무 가이드를 한눈에 확인해보세요.
          </p>
        </section>

        {/* 카테고리 */}
        <section className="mb-12 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-500 hover:border-black hover:text-black"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* 게시물 없음 */}
        {filteredBoards.length === 0 ? (
          <section className="border-y border-gray-200 py-24 text-center">
            <p className="text-sm text-gray-400">
              등록된 게시물이 없습니다.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">

            {filteredBoards.map((board) => {
              const thumbnail =
                getThumbnail(board);

              return (
                <Link
                  key={board.id}
                  href={`/boards/${board.id}`}
                  className="group block"
                >
                  {/* 이미지 */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f4f0]">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={board.title || "게시물 이미지"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs tracking-[0.2em] text-gray-300">
                            LABBRIDGE
                          </p>

                          <p className="mt-3 text-sm text-gray-300">
                            CONTENT
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 카테고리 */}
                    <div className="absolute left-4 top-4">
                      <span className="bg-white/95 px-3 py-2 text-xs font-semibold backdrop-blur">
                        {board.category ||
                          "LABBRIDGE"}
                      </span>
                    </div>
                  </div>

                  {/* 텍스트 */}
                  <div className="pt-5">

                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold tracking-[0.14em] text-gray-400">
                        {board.category ||
                          "LABBRIDGE"}
                      </p>

                      <span className="text-xs text-gray-300 transition group-hover:text-black">
                        VIEW →
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold leading-7 tracking-[-0.03em] md:text-[22px]">
                      {board.title}
                    </h2>

                    {board.summary && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {board.summary}
                      </p>
                    )}

                  </div>
                </Link>
              );
            })}

          </section>
        )}

      </div>
    </main>
  );
}