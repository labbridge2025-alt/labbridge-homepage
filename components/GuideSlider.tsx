"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

import "swiper/css";

type GuideBanner = {
  id: string;
  tag?: string;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
  active?: boolean;
};

export default function GuideSlider() {
  const [guideBanners, setGuideBanners] = useState<GuideBanner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const loadGuideBanners = async () => {
      const q = query(collection(db, "guideBanners"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<GuideBanner, "id">),
        }))
        .filter((item) => item.active !== false);

      setGuideBanners(data);
    };

    loadGuideBanners();
  }, []);

  if (guideBanners.length === 0) return null;

  return (
    <section className="overflow-hidden bg-[#f7f7f7] py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5">
        <div className="mb-10 text-center lg:mb-12">
          <p className="mb-3 text-base text-gray-500 lg:mb-4 lg:text-2xl">
            브랜드와 제품 기획부터 출시까지
          </p>

          <h2 className="mb-7 text-4xl font-bold lg:mb-8 lg:text-6xl">
            브랜드 런칭 가이드
          </h2>

          <div className="flex flex-wrap justify-center gap-5 text-base lg:gap-8 lg:text-2xl">
            {guideBanners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  swiperRef.current?.slideToLoop(index);
                }}
                className={
                  activeIndex === index
                    ? "border-b border-black pb-1 text-black"
                    : "pb-1 text-gray-500"
                }
              >
                {item.tag || `#${item.title}`}
              </button>
            ))}
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          loop={guideBanners.length > 1}
          speed={600}
          spaceBetween={24}
          breakpoints={{
            0: {
              slidesPerView: 1,
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
              <div className="relative aspect-square overflow-hidden rounded-sm bg-white">
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