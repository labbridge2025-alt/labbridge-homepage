"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBoard = async () => {
      const snap = await getDoc(doc(db, "boards", id));

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      setBoard({
        id: snap.id,
        ...snap.data(),
      });

      setLoading(false);
    };

    if (id) loadBoard();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-24">
        <div className="mx-auto max-w-4xl text-gray-400">불러오는 중...</div>
      </main>
    );
  }

  if (!board || board.isPublished !== true) {
    return (
      <main className="min-h-screen px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/boards")}
            className="mt-6 rounded-full bg-black px-5 py-2 text-white"
          >
            목록으로
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.push("/boards")}
          className="mb-8 text-sm text-gray-500 hover:text-black"
        >
          ← 목록으로
        </button>

        <div className="border-b border-black pb-8">
          <p className="mb-3 text-sm font-semibold text-gray-400">
            {board.category}
          </p>

          <h1 className="text-4xl font-bold">{board.title}</h1>

          {board.summary && (
            <p className="mt-4 text-lg text-gray-500">{board.summary}</p>
          )}
        </div>

        <div
  className="prose prose-neutral mt-10 max-w-none"
  dangerouslySetInnerHTML={{
    __html: board.content || "<p>내용이 없습니다.</p>",
  }}
/>

        {board.files?.length > 0 && (
          <div className="mt-12 rounded-2xl border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-bold">첨부파일</h2>

            <div className="flex flex-col gap-3">
              {board.files.map((file: any, index: number) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  className="text-sm text-gray-600 underline"
                >
                  {file.name || `첨부파일 ${index + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}