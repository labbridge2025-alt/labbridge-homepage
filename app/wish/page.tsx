"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";

export default function WishPage() {
  const [items, setItems] = useState<any[]>([]);

  const loadWishItems = async () => {
    const saved = localStorage.getItem("labbridge-wish");
    if (!saved) return;

    const ids: string[] = JSON.parse(saved);

    const products = await Promise.all(
      ids.map(async (id) => {
        const snap = await getDoc(doc(db, "products", id));
        if (!snap.exists()) return null;

        return {
          id: snap.id,
          ...snap.data(),
        };
      })
    );

    setItems(products.filter(Boolean));
  };

  useEffect(() => {
    loadWishItems();
  }, []);

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    localStorage.setItem(
      "labbridge-wish",
      JSON.stringify(next.map((item) => item.id))
    );
  };

  return (
    <>
      <Header />

      <main className="pt-40 pb-32">
        <section className="max-w-6xl mx-auto px-10">
          <h1 className="text-5xl font-bold mb-12">관심상품</h1>

          {items.length === 0 ? (
            <div className="border rounded-2xl p-20 text-center text-gray-500">
              담긴 관심상품이 없습니다.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-2xl p-5"
                  >
                    <a
                      href={`/products/${item.id}`}
                      className="flex items-center gap-5"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      )}

                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {item.category}
                        </p>
                        <h2 className="text-2xl font-bold">{item.name}</h2>
                        <p className="text-sm text-gray-500 mt-2">
                          MOQ {item.moq}
                        </p>
                      </div>
                    </a>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="border rounded-xl px-5 py-3 text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end gap-3">
                <a
                  href="/products"
                  className="border rounded-xl px-8 py-4 font-bold"
                >
                  제품 더 보기
                </a>

                <a
                  href="/estimate"
                  className="bg-black text-white rounded-xl px-8 py-4 font-bold"
                >
                  선택상품 문의하기
                </a>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}