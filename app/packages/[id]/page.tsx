"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";

export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [packageItem, setPackageItem] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPackage = async () => {
      const snap = await getDoc(doc(db, "packages", id));

      if (snap.exists()) {
        const data: any = snap.data();

        setPackageItem({
          id: snap.id,
          ...data,
        });

        setSelectedImage(data.imageUrl || "");
      }
    };

    loadPackage();
  }, [id]);

  if (!packageItem) {
    return <main className="pt-32 text-center">불러오는 중...</main>;
  }

  const images = [packageItem.imageUrl, ...(packageItem.detailImages || [])].filter(
    Boolean
  );

  return (
    <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[760px_520px] gap-12 items-start">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="hidden lg:flex flex-col gap-4 w-24">
              {images.map((img: string, index: number) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border ${
                    selectedImage === img ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-[760px] bg-gray-100 rounded-3xl overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={packageItem.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="flex lg:hidden gap-2 overflow-x-auto pt-2 pb-1 w-fit max-w-full">
              {images.map((img: string, index: number) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border ${
                    selectedImage === img ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm lg:text-lg text-gray-500 mb-3 lg:mb-4">
              {packageItem.categoryName}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 lg:mb-6 leading-tight">
              {packageItem.name}
            </h1>

            {packageItem.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6 lg:mb-8">
                {packageItem.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 lg:py-2 rounded-full bg-gray-100 text-xs lg:text-sm"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-b py-6 lg:py-8 space-y-4 lg:space-y-5 text-base lg:text-xl">
              <div className="flex justify-between">
                <span className="text-gray-500">MOQ</span>
                <strong>{packageItem.moq || "-"}</strong>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-gray-500 shrink-0">옵션</span>
                <strong className="text-right">{packageItem.option || "-"}</strong>
              </div>
            </div>

            <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => {
                  const saved = localStorage.getItem("labbridge-wish");
                  const current: string[] = saved ? JSON.parse(saved) : [];

                  if (!current.includes(packageItem.id)) {
                    const next = [...current, packageItem.id];
                    localStorage.setItem("labbridge-wish", JSON.stringify(next));
                    alert("관심상품에 담겼습니다.");
                  } else {
                    alert("이미 관심상품에 담긴 항목입니다.");
                  }
                }}
                className="border rounded-2xl py-4 lg:py-5 font-bold"
              >
                관심상품 담기
              </button>

              <button
                type="button"
                onClick={() => {
                  const saved = localStorage.getItem("labbridge-wish");
                  const current: string[] = saved ? JSON.parse(saved) : [];

                  const next = current.includes(packageItem.id)
                    ? current
                    : [...current, packageItem.id];

                  localStorage.setItem("labbridge-wish", JSON.stringify(next));

                  window.location.href = "/estimate";
                }}
                className="bg-black text-white rounded-2xl py-4 lg:py-5 font-bold text-center"
              >
                이 패키지로 문의하기
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 mt-16 lg:mt-24">
        <div className="border-t pt-10 lg:pt-16">
          {packageItem.description && (
            <div className="mb-14 lg:mb-20">
              <h2 className="text-2xl lg:text-3xl font-bold mb-5 lg:mb-8">
                패키지 설명
              </h2>

              <p className="text-sm lg:text-base text-gray-700 leading-loose whitespace-pre-wrap">
                {packageItem.description}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}