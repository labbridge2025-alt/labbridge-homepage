"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      const q = query(
        collection(db, "portfolio"),
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

    loadPortfolio();
  }, []);

  return (
    <main className="pt-40 pb-32 bg-white">
      <section className="max-w-7xl mx-auto px-10">
        <p className="text-xl font-semibold text-gray-500 mb-6">
          PORTFOLIO
        </p>

        <h1 className="text-7xl font-bold mb-8">
          제조 포트폴리오
        </h1>

        <p className="text-2xl text-gray-600 mb-20">
          랩브릿지가 함께한 OEM · ODM 제조 사례를 확인해보세요.
        </p>

        {items.length === 0 ? (
          <div className="border rounded-2xl p-20 text-center text-gray-500">
            등록된 포트폴리오가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-2xl overflow-hidden bg-white"
              >
                <div className="h-[360px] bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      IMAGE
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <p className="text-gray-500 font-semibold mb-3">
                    {item.brand}
                  </p>

                  <h2 className="text-3xl font-bold mb-4">
                    {item.product}
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}