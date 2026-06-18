"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PortfolioItem = {
  id: string;
  brand?: string;
  productName?: string;
  product?: string;
  title?: string;
  name?: string;
  description?: string;
  desc?: string;
  imageUrl?: string;
  image?: string;
};

export default function HomePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      const q = query(
        collection(db, "portfolio"),
        orderBy("createdAt", "desc"),
        limit(4)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PortfolioItem, "id">),
      }));

      setItems(data);
    };

    loadPortfolio();
  }, []);

  return (
    <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 lg:mb-20">
          <div>
            <p className="text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
              PORTFOLIO
            </p>

          </div>

          <a href="/portfolio" className="text-lg lg:text-2xl font-semibold">
            VIEW MORE →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-black rounded-2xl overflow-hidden"
            >
              <div className="h-[260px] lg:h-[360px] bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl || item.image}
                  alt={item.productName || item.title || "포트폴리오"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <p className="text-gray-500 font-semibold mb-4">
                  {item.brand || item.name || ""}
                </p>

                <h3 className="text-2xl lg:text-3xl font-bold mb-5 uppercase">
                  {item.productName || item.product || item.name || item.title || "제품명"}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {item.description || item.desc || "OEM · ODM 제조 사례"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}