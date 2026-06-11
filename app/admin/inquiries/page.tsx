"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function InquiriesPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "inquiries"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      setItems(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto py-20 px-6">
      <h1 className="text-5xl font-bold mb-10">
        문의 내역
      </h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-2xl p-8 shadow-sm"
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {item.company}
              </h2>

              <span className="text-gray-500">
                {item.createdAt?.toDate?.().toLocaleString("ko-KR")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-lg">
              <p><strong>담당자</strong> : {item.name}</p>
              <p><strong>연락처</strong> : {item.phone}</p>

              <p><strong>이메일</strong> : {item.email}</p>
              <p><strong>출고희망일</strong> : {item.dueDate}</p>

              <p><strong>제형</strong> : {item.formula}</p>
              <p><strong>용기</strong> : {item.container}</p>

              <p><strong>패키지</strong> : {item.packageType}</p>
              <p><strong>생산수량</strong> : {item.quantity}</p>

              <p><strong>예산</strong> : {item.budget}</p>
              <p><strong>판매국가</strong> : {item.country}</p>
            </div>

            <div className="mt-6 border-t pt-6">
              <p className="font-bold mb-2">
                문의사항
              </p>

              <p className="whitespace-pre-wrap">
                {item.memo}
              </p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="border rounded-xl p-10 text-center">
            문의 내역이 없습니다.
          </div>
        )}
      </div>
    </main>
  );
}