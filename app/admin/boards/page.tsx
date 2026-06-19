"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const categories = ["전체", "원료자료", "가이드라인", "트렌드자료", "공지사항", "FAQ", "기타"];

export default function AdminBoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    loadBoards();
  }, []);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      const matchCategory =
        selectedCategory === "전체" || board.category === selectedCategory;

      const matchSearch =
        board.title?.includes(search) || board.summary?.includes(search);

      return matchCategory && matchSearch;
    });
  }, [boards, selectedCategory, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await deleteDoc(doc(db, "boards", id));
    alert("삭제되었습니다.");
    loadBoards();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">게시판 관리</h1>
          <p className="mt-2 text-gray-500">
            원료자료, 가이드라인, 트렌드자료, 공지사항, FAQ를 관리합니다.
          </p>
        </div>

        <Link
          href="/admin/boards/new"
          className="rounded-xl bg-black px-5 py-3 font-semibold text-white"
        >
          + 게시글 등록
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          ["원료자료", "원료 설명 콘텐츠"],
          ["가이드라인", "제조/용기/패키지 가이드"],
          ["트렌드자료", "시장 트렌드 및 인기 제형"],
          ["공지사항", "서비스 안내 및 공지"],
          ["FAQ", "자주 묻는 질문"],
          ["기타", "기타 게시글"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-2xl border border-black bg-white p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-black bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">게시글 목록</h2>

          <div className="flex gap-2">
            <select
              className="rounded-xl border border-gray-300 px-4 py-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <input
              className="rounded-xl border border-gray-300 px-4 py-2"
              placeholder="제목 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">카테고리</th>
              <th className="py-3">제목</th>
              <th className="py-3">한줄 설명</th>
              <th className="py-3">첨부</th>
              <th className="py-3">상태</th>
              <th className="py-3">작업</th>
            </tr>
          </thead>

          <tbody>
            {filteredBoards.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            ) : (
              filteredBoards.map((board) => (
                <tr key={board.id} className="border-b">
                  <td className="py-4 font-semibold">{board.category}</td>
                  <td className="py-4">{board.title}</td>
                  <td className="py-4 text-gray-500">{board.summary}</td>
                  <td className="py-4">
                    {board.files?.length ? `${board.files.length}개` : "-"}
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        board.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {board.isPublished ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/boards/${board.id}`}
                        className="hover:underline"
                      >
                        수정
                      </Link>

                      <button
                        onClick={() => handleDelete(board.id)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}