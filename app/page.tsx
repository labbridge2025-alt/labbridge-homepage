"use client";
import Header from "@/components/Header";
import GuideSlider from "@/components/GuideSlider";
import HomePortfolio from "@/components/HomePortfolio";
import Image from "next/image";
import { Heart, Menu, User } from "lucide-react";
import { useState } from "react";
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header />

<main className="pt-0 md:pt-24">
        <section className="relative w-full">
      
{/* PC */}
<div className="relative hidden h-[720px] w-full overflow-hidden md:block">
  <img
    src="/images/main-hero-new.png"
    alt="LabBridge"
    className="h-full w-full object-cover object-left"
  />

  <div className="absolute left-20 top-[90px] z-10">
    <p className="mb-5 text-[22px] font-medium tracking-wide text-neutral-800">
      OEM/ODM SKINCARE SOLUTION
    </p>

    <h1 className="mb-7 text-[64px] font-extrabold leading-[1.18] tracking-[-2px] text-neutral-900">
      화장품 제조의
      <br />
      시작부터 출시까지
    </h1>

    <p className="mb-8 text-[20px] leading-[1.8] text-neutral-700">
      제형 개발부터 패키지, 생산, 인허가까지
      <br />
      원스톱 OEM/ODM 솔루션으로 브랜드의 성공을 함께 만듭니다.
    </p>

    <div className="flex gap-4">
      <a
        href="/estimate"
        className="flex h-[58px] w-[220px] items-center justify-center gap-5 rounded-md bg-black text-[17px] font-semibold text-white"
      >
        제조 문의하기 <span>→</span>
      </a>

      <a
        href="/portfolio"
        className="flex h-[58px] w-[220px] items-center justify-center gap-5 rounded-md border border-neutral-500 bg-white/30 text-[17px] font-semibold text-neutral-900 backdrop-blur-sm"
      >
        포트폴리오 보기 <span>→</span>
      </a>
    </div>
  </div>
</div>

          {/* Mobile */}
          <div className="relative block h-[calc(100vh-96px)] overflow-hidden md:hidden">
            <img
  src="/images/main-hero-mobile.png"
  alt="LabBridge Mobile"
  className="h-full w-full object-cover object-top"
/>

{/* Mobile Header */}
<div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 pt-7">

  {/* 햄버거 */}
  <button
    type="button"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="w-[44px] flex justify-start"
  >
    <Menu size={32} strokeWidth={1.8} />
  </button>

  {/* 로고 */}
  <a
    href="/"
    className="absolute left-1/2 -translate-x-1/2"
  >
    <img
      src="/logo.png"
      alt="LabBridge"
      className="h-11 w-auto"
    />
  </a>

  {/* 오른쪽 아이콘 */}
  <div className="flex w-[72px] justify-end gap-4">
    <a href="/wish">
      <Heart size={25} strokeWidth={1.9} />
    </a>

    <a href="/login">
      <User size={25} strokeWidth={1.9} />
    </a>
  </div>

</div>

{/* 모바일 메뉴 */}
{mobileMenuOpen && (
  <div className="absolute left-5 right-5 top-[88px] z-30 rounded-2xl bg-white p-6 shadow-2xl">
<nav className="flex flex-col gap-5 text-[17px] font-semibold">
  <a href="/process">회사소개</a>
  <a href="/products">제형보러가기</a>
  <a href="/containers">용기보러가기</a>
  <a href="/packages">패키지보러가기</a>
  <a href="/portfolio">포트폴리오</a>
  <a href="/boards">LAB MEMBERS</a>
  <a href="/estimate">문의하기</a>
  <a href="/wish">관심상품</a>
  <a href="/mypage">내정보</a>
</nav>
  </div>
)}
            <div className="absolute left-1/2 top-[29%] z-10 w-[78%] -translate-x-1/2 rounded-[28px] border border-white/80 bg-white/70 px-6 py-6 text-center shadow-sm backdrop-blur-md">
              <div className="mx-auto mb-5 h-px w-14 bg-neutral-500" />

              <p className="mb-5 text-[13px] font-medium tracking-[0.08em] text-neutral-600">
                OEM/ODM SKINCARE SOLUTION
              </p>

              <h1 className="mb-6 text-[25px] font-extrabold leading-[1.25] tracking-[-1.5px] text-neutral-900">
                화장품 제조,
                <br />
                어렵지 않게 시작하세요
              </h1>

              <p className="mb-8 text-[17px] leading-[1.8] text-neutral-600">
                제형부터 생산, 출시까지
                <br />
                랩브릿지가 함께합니다.
              </p>

              <a
                href="/estimate"
                className="mx-auto flex h-[58px] w-[230px] items-center justify-center gap-5 rounded-xl bg-black text-[18px] font-bold text-white"
              >
                제조 문의하기 <span>→</span>
              </a>
            </div>

            <div className="absolute bottom-[5%] left-1/2 z-10 grid w-[88%] -translate-x-1/2 grid-cols-4 divide-x divide-neutral-300 text-center">
              {[
                {
                  icon: "/images/icon/icon-formula.png",
                  title: "맞춤형",
                  desc: "제형 개발",
                },
                {
                  icon: "/images/icon/icon-package.png",
                  title: "패키지 디자인",
                  desc: "& 소싱",
                },
                {
                  icon: "/images/icon/icon-license.png",
                  title: "인허가 &",
                  desc: "품질 관리",
                },
                {
                  icon: "/images/icon/icon-production.png",
                  title: "생산 &",
                  desc: "납품 지원",
                },
              ].map((item) => (
                <div key={item.title} className="px-2">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="mx-auto mb-2 h-8 w-8 object-contain"
                  />
                  <p className="text-[11px] font-medium leading-[1.5] text-neutral-800">
                    {item.title}
                    <br />
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GuideSlider />

        {/* SERVICE - PC/태블릿에서만 표시 */}
        <section className="hidden md:block bg-white px-5 py-24 sm:px-8 lg:px-20 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 text-4xl font-bold lg:mb-20 lg:text-6xl">
              SERVICE
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {["제형", "용기", "부자재", "원료", "임상", "인허가"].map(
                (item) => (
                  <div key={item} className="border p-6 lg:p-10">
                    <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                      {item}
                    </h3>

                    <p className="leading-relaxed text-gray-600">
                      화장품 제조에 필요한 항목을 상담합니다.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* PROCESS - PC/태블릿에서만 표시 */}
        <section className="hidden bg-gray-50 px-5 py-24 sm:px-8 md:block lg:px-20 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 text-4xl font-bold lg:mb-20 lg:text-6xl">
              PROCESS
            </h2>

            <div className="relative">
              <div className="absolute left-0 right-0 top-[150px] hidden h-px bg-gray-300 lg:block" />

              <div className="relative z-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
                {[
                  {
                    num: "01",
                    title: "상담",
                    desc: "브랜드 컨셉 및 제품 방향 상담",
                    image: "/images/process/consult.png",
                  },
                  {
                    num: "02",
                    title: "샘플",
                    desc: "제형 테스트 및 샘플 제작",
                    image: "/images/process/sample.png",
                  },
                  {
                    num: "03",
                    title: "견적",
                    desc: "원가 및 생산 일정 안내",
                    image: "/images/process/estimate.png",
                  },
                  {
                    num: "04",
                    title: "생산",
                    desc: "제조 및 품질 관리 진행",
                    image: "/images/process/production.png",
                  },
                  {
                    num: "05",
                    title: "출고",
                    desc: "검수 후 안전하게 출고",
                    image: "/images/process/delivery.png",
                  },
                ].map((item) => (
                  <div key={item.num} className="group">
                    <div className="relative mb-6 overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-[5/7] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xl font-semibold text-gray-400">
                        {item.num}
                      </span>

                      <h3 className="text-2xl font-bold lg:text-3xl">
                        {item.title}
                      </h3>
                    </div>

                    <p className="leading-relaxed text-gray-500">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT LABBRIDGE */}
        <section className="bg-white px-5 py-16 sm:px-8 md:py-24 lg:px-20 lg:py-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-4 text-[14px] font-semibold tracking-wide text-gray-500 lg:mb-6 lg:text-2xl">
                ABOUT LABBRIDGE
              </p>

              <h2 className="mb-6 text-[32px] font-bold leading-[1.25] tracking-[-1px] lg:mb-10 lg:text-6xl">
                브랜드와 제조사를
                <br />
                연결하는 화장품 제조 플랫폼
              </h2>

              <p className="text-[16px] leading-[1.8] text-gray-600 lg:text-2xl">
                랩브릿지는 제형, 용기, 부자재, 원료, 임상 및 인허가까지
                <br className="hidden lg:block" />
                화장품 제조에 필요한 과정을 한 번에 연결합니다.
              </p>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-2xl lg:h-[500px]">
              <Image
                src="/images/about/about.png"
                alt="About LabBridge"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <HomePortfolio />

        {/* CONTACT */}
        <section className="bg-black px-5 py-20 text-white sm:px-8 lg:px-20 lg:py-40">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-0">
            <div>
              <p className="mb-4 text-lg lg:mb-6 lg:text-2xl">
                CONTACT US
              </p>

              <h2 className="text-3xl font-bold leading-tight lg:text-6xl">
                화장품 제조 상담이 필요하신가요?
              </h2>
            </div>

            <a
              href="https://pf.kakao.com/_DXxcxon"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white px-8 py-4 text-lg font-semibold lg:px-16 lg:py-8 lg:text-3xl"
            >
              문의하기
            </a>
          </div>
        </section>
      </main>
    </>
  );
}