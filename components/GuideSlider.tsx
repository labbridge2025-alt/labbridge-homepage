"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  const repeatedBanners = useMemo(() => {
    return [...guideBanners, ...guideBanners, ...guideBanners];
  }, [guideBanners]);

  if (guideBanners.length === 0) return null;

  const middleStartIndex = guideBanners.length;

  return (
    <section className="overflow-hidden bg-[#f7f7f7] py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-5">
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
                  swiperRef.current?.slideTo(middleStartIndex + index, 700);
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
          initialSlide={middleStartIndex}
          autoplay={{
            delay: 1800,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const realIndex = swiper.activeIndex % guideBanners.length;
            setActiveIndex(realIndex);

            if (swiper.activeIndex <= guideBanners.length - 1) {
              swiper.slideTo(swiper.activeIndex + guideBanners.length, 0);
            }

            if (swiper.activeIndex >= guideBanners.length * 2) {
              swiper.slideTo(swiper.activeIndex - guideBanners.length, 0);
            }
          }}
          centeredSlides={true}
          speed={700}
          spaceBetween={28}
          breakpoints={{
            0: {
              slidesPerView: 1.15,
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
          {repeatedBanners.map((item, index) => (
  <SwiperSlide key={`${item.id}-${index}`}>
    {({ isActive }) => (
      <div
        className={
          isActive
            ? "relative aspect-square overflow-hidden rounded-sm bg-white opacity-100 transition-all duration-500"
            : "relative aspect-square overflow-hidden rounded-sm bg-white opacity-35 scale-95 transition-all duration-500"
        }
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          priority={index === middleStartIndex}
          className="object-cover"
        />
      </div>
    )}
  </SwiperSlide>
))}
        </Swiper>
      </div>
    </section>
  );
}