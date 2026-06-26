"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { db } from "@/lib/firebase";

import "swiper/css";

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
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      const q = query(
        collection(db, "portfolio"),
        orderBy("createdAt", "desc"),
        limit(8)
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

  const repeatedItems = useMemo(() => {
    return [...items, ...items, ...items];
  }, [items]);

  if (items.length === 0) return null;

  const middleStartIndex = items.length;

  return (
    <section className="overflow-hidden bg-gray-50 px-5 py-24 sm:px-8 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
          <div>
            <p className="mb-4 text-lg font-semibold lg:mb-6 lg:text-2xl">
              PORTFOLIO
            </p>
          </div>

          <a href="/portfolio" className="text-lg font-semibold lg:text-2xl">
            VIEW MORE →
          </a>
        </div>

        <Swiper
  modules={[Autoplay]}
  initialSlide={middleStartIndex}
  autoplay={{
    delay: 1800,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  }}
  onSwiper={(swiper) => {
    swiperRef.current = swiper;
  }}
  onSlideChange={(swiper) => {
    if (swiper.activeIndex <= items.length - 1) {
      swiper.slideTo(swiper.activeIndex + items.length, 0);

      setTimeout(() => {
        swiper.autoplay.start();
      }, 0);
    }

    if (swiper.activeIndex >= items.length * 2) {
      swiper.slideTo(swiper.activeIndex - items.length, 0);

      setTimeout(() => {
        swiper.autoplay.start();
      }, 0);
    }
  }}
  centeredSlides={true}
  speed={700}
  spaceBetween={28}
  breakpoints={{
    0: {
      slidesPerView: 1.05,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2.1,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 32,
    },
  }}
>
          {repeatedItems.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`}>
              {({ isActive }) => (
                <div
                  className={
                    isActive
                      ? "overflow-hidden rounded-2xl border border-black bg-white opacity-100 transition-all duration-500"
                      : "overflow-hidden rounded-2xl border border-black bg-white opacity-35 scale-95 transition-all duration-500"
                  }
                >
                  <div className="h-[260px] overflow-hidden bg-gray-100 lg:h-[360px]">
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.productName || item.title || "포트폴리오"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <p className="mb-4 font-semibold text-gray-500">
                      {item.brand || item.name || ""}
                    </p>

                    <h3 className="mb-5 text-2xl font-bold uppercase lg:text-3xl">
                      {item.productName ||
                        item.product ||
                        item.name ||
                        item.title ||
                        "제품명"}
                    </h3>

                    <p className="leading-relaxed text-gray-600">
                      {item.description || item.desc || "OEM · ODM 제조 사례"}
                    </p>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}