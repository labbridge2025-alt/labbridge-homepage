"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
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
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32 bg-white">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <p className="text-sm sm:text-base lg:text-xl font-semibold text-gray-500 mb-4 lg:mb-6">
          PORTFOLIO
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-5 lg:mb-8 leading-tight">
          제조 포트폴리오
        </h1>

        <p className="text-base sm:text-lg lg:text-2xl text-gray-600 mb-12 lg:mb-20 leading-relaxed">
          랩브릿지가 함께한 OEM · ODM 제조 사례를 확인해보세요.
        </p>

        {items.length === 0 ? (
          <div className="border rounded-2xl p-12 lg:p-20 text-center text-gray-500">
            등록된 포트폴리오가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-2xl overflow-hidden bg-white"
              >
                <div className="h-[240px] sm:h-[300px] lg:h-[360px] bg-gray-100">
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

                <div className="p-5 lg:p-8">
                  <p className="text-sm lg:text-base text-gray-500 font-semibold mb-2 lg:mb-3">
                    {item.brand}
                  </p>

                  <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 leading-tight">
                    {item.product}
                  </h2>

                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
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