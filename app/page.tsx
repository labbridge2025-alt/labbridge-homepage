import Header from "@/components/Header";
import GuideSlider from "@/components/GuideSlider";
import HomePortfolio from "@/components/HomePortfolio";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Header />

      <main>
<section className="relative w-full pt-[86px]">
  <img
    src="/images/main-hero-new.png"
    alt="LabBridge"
    className="block h-auto w-full"
  />

  <div className="absolute left-8 top-[150px] z-10 sm:left-12 lg:left-20">
    <p className="mb-6 text-base font-medium tracking-wide text-neutral-800 sm:text-lg lg:text-[22px]">
      OEM/ODM SKINCARE SOLUTION
    </p>

    <h1 className="mb-8 text-[44px] font-extrabold leading-[1.25] tracking-[-2px] text-neutral-900 sm:text-[58px] lg:text-[72px]">
      화장품 제조의
      <br />
      시작부터 출시까지
    </h1>

    <p className="mb-9 text-base leading-[1.8] text-neutral-700 sm:text-lg lg:text-[22px]">
      제형 개발부터 패키지, 생산, 인허가까지
      <br />
      원스톱 OEM/ODM 솔루션으로 브랜드의 성공을 함께 만듭니다.
    </p>

    <div className="flex flex-col gap-4 sm:flex-row">
      <a
        href="/estimate"
        className="flex h-[58px] w-[220px] items-center justify-center gap-5 rounded-md bg-black text-[17px] font-semibold text-white"
      >
        제조 문의하기
        <span>→</span>
      </a>

      <a
        href="/portfolio"
        className="flex h-[58px] w-[220px] items-center justify-center gap-5 rounded-md border border-neutral-500 bg-white/30 text-[17px] font-semibold text-neutral-900 backdrop-blur-sm"
      >
        포트폴리오 보기
        <span>→</span>
      </a>
    </div>
  </div>
</section>

<GuideSlider />
        <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-10 lg:mb-20">
              SERVICE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {["제형", "용기", "부자재", "원료", "임상", "인허가"].map(
                (item) => (
                  <div key={item} className="border p-6 lg:p-10">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                      {item}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      화장품 제조에 필요한 항목을 상담합니다.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-10 lg:mb-20">
              PROCESS
            </h2>

            <div className="relative">
  <div className="hidden lg:block absolute top-[150px] left-0 right-0 h-px bg-gray-300" />

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 relative z-10">
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
        <div className="relative bg-gray-50 mb-6 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full aspect-[5/7] object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-gray-400 text-xl font-semibold">
            {item.num}
          </span>

          <h3 className="text-2xl lg:text-3xl font-bold">
            {item.title}
          </h3>
        </div>

        <p className="text-gray-500 leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</div>
          </div>
        </section>

        <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <p className="text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
                ABOUT LABBRIDGE
              </p>

              <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 lg:mb-10">
                브랜드와 제조사를
                <br />
                연결하는 화장품 제조 플랫폼
              </h2>

              <p className="text-lg lg:text-2xl leading-relaxed text-gray-600">
                랩브릿지는 제형, 용기, 부자재, 원료, 임상 및 인허가까지
                화장품 제조에 필요한 과정을 한 번에 연결합니다.
              </p>
            </div>

            <div className="relative h-[320px] lg:h-[500px] overflow-hidden rounded-2xl">
  <Image
    src="/images/about/about.png"
    alt="About LabBridge"
    fill
    className="object-cover"
  />
</div>
          </div>
        </section>

       <HomePortfolio />

        <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-black text-white">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-0 items-start lg:items-center justify-between">
            <div>
              <p className="text-lg lg:text-2xl mb-4 lg:mb-6">CONTACT US</p>

              <h2 className="text-3xl lg:text-6xl font-bold leading-tight">
                화장품 제조 상담이 필요하신가요?
              </h2>
            </div>

            <a
              href="https://pf.kakao.com/_DXxcxon"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 lg:px-16 py-4 lg:py-8 border border-white text-lg lg:text-3xl font-semibold"
            >
              문의하기
            </a>
          </div>
        </section>
      </main>

    </>
  );
}