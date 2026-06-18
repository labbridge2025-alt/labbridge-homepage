"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

import "swiper/css";

type GuideBanner = {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
};

export default function GuideSlider() {
  const [guideBanners, setGuideBanners] = useState<GuideBanner[]>([]);

  useEffect(() => {
    const loadGuideBanners = async () => {
      const q = query(
        collection(db, "guideBanners"),
        orderBy("order", "asc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GuideBanner, "id">),
      }));

      setGuideBanners(data);
    };

    loadGuideBanners();
  }, []);

  if (guideBanners.length === 0) return null;

  return (
    <section className="py-20 bg-[#f7f7f7] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-lg lg:text-2xl text-gray-500 mb-4">
            브랜드와 제품 기획부터 출시까지
          </p>

          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            브랜드 런칭 가이드
          </h2>

          <div className="flex justify-center gap-8 text-lg lg:text-2xl">
            <span className="border-b border-black">#제형개발</span>
            <span className="text-gray-500">#제품출시</span>
            <span className="text-gray-500">#소량런칭</span>
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          initialSlide={0}
          loop={guideBanners.length > 3}
          speed={600}
          autoplay={{
            delay: 1800,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          spaceBetween={24}
          breakpoints={{
            0: {
              slidesPerView: 1.12,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
          }}
        >
          {guideBanners.map((item, index) => (
            <SwiperSlide key={item.id}>
              <div className="relative aspect-square bg-white overflow-hidden rounded-sm">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}