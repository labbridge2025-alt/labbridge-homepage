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

const categories = ["전체", "원료자료", "가이드라인", "트렌드자료", "공지사항", "FAQ", "기타"];

export default function BoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    const loadBoards = async () => {
      const q = query(collection(db, "boards"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      setBoards(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    loadBoards();
  }, []);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      const isPublished = board.isPublished === true;
      const matchCategory =
        selectedCategory === "전체" || board.category === selectedCategory;

      return isPublished && matchCategory;
    });
  }, [boards, selectedCategory]);

  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold text-gray-400">
            LABBRIDGE BOARD
          </p>
          <h1 className="text-4xl font-bold">랩브리지 안내</h1>
          <p className="mt-4 text-gray-500">
            원료자료, 가이드라인, 트렌드자료, 공지사항을 확인하실 수 있습니다.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-5 py-2 text-sm ${
                selectedCategory === category
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="border-t border-black">
          {filteredBoards.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            filteredBoards.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="block border-b border-gray-200 py-6 hover:bg-gray-50"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-400">
                      {board.category}
                    </p>
                    <h2 className="text-xl font-bold">{board.title}</h2>
                    <p className="mt-2 text-gray-500">{board.summary}</p>
                  </div>

                  <span className="text-sm text-gray-400">자세히 보기 →</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}