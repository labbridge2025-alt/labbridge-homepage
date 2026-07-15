import Header from "@/components/Header";
import Image from "next/image";
export default function ProcessPage() {
  const solutions = [
    {
      title: "빠른 런칭",
      desc: "검증된 제형과 용기 조합으로 개발 기간을 줄이고 빠르게 출시합니다.",
    },
    {
      title: "소량 생산",
      desc: "초기 브랜드도 부담 없이 시작할 수 있도록 MOQ 기준을 맞춰 제안합니다.",
    },
    {
      title: "로고앤고",
      desc: "기존 제형에 브랜드 디자인을 적용해 빠르게 완제품화합니다.",
    },
    {
      title: "임상 서비스",
      desc: "제품 컨셉에 맞는 임상, 기능성, 시험 항목을 함께 검토합니다.",
    },
    {
      title: "풀필먼트",
      desc: "출고 이후 물류, 납품, 추가 생산까지 연결할 수 있도록 지원합니다.",
    },
  ];

  const process = [
    "문의 접수",
    "제품 기획",
    "샘플 개발",
    "사양 확정",
    "생산 진행",
    "출고",
  ];

  return (
    <>
      <Header />

      <main className="pt-28 lg:pt-40 pb-24 lg:pb-32">
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-sm sm:text-base lg:text-xl font-semibold text-gray-500 mb-4 lg:mb-6">
            LABBRIDGE SOLUTIONS
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-20">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 break-keep">
  브랜드 런칭을 위한
  <br />
  원스톱 제조 솔루션
</h1>

              <p className="text-base sm:text-lg lg:text-2xl text-gray-600 leading-relaxed">
                랩브릿지는 제품 기획부터 제형 개발, 용기, 부자재, 임상,
                생산, 출고까지 화장품 제조 전 과정을 연결합니다.
              </p>
            </div>

            <div className="relative h-[280px] lg:h-[420px] rounded-3xl overflow-hidden">
  <Image
    src="/images/process-hero.png"
    alt="랩브릿지 솔루션"
    fill
    className="object-cover"
    priority
  />
</div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-24">
            {solutions.map((item) => (
              <div
                key={item.title}
                className="border rounded-2xl p-5 lg:p-6 bg-white"
              >
                <h2 className="text-lg lg:text-2xl font-bold mb-3">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <section className="text-center mb-24">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              빠르게 시작하고, 안정적으로 생산합니다
            </h2>

            <p className="text-base lg:text-xl text-gray-600 leading-relaxed mb-14">
              검증된 제조 프로세스를 바탕으로 브랜드의 출시 일정을
              효율적으로 단축합니다.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["1K", "1,000개부터 시작 가능"],
                ["4~6주", "제품 개발 기간 단축"],
                ["QA", "품질 및 안정성 검토"],
                ["ODM", "제형·용기 매칭"],
              ].map(([big, small]) => (
                <div key={big} className="py-8">
                  <p className="text-4xl lg:text-6xl font-bold mb-4">
                    {big}
                  </p>
                  <p className="text-sm lg:text-lg font-semibold">
                    {small}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-50 rounded-3xl p-6 lg:p-14 mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="relative h-[260px] lg:h-[420px] rounded-2xl overflow-hidden">
  <Image
    src="/images/process-product.png"
    alt="랩브릿지 제조"
    fill
    className="object-cover"
  />
</div>

              <div>
                <h2 className="text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                  이런 분들께 추천합니다
                </h2>

                <div className="space-y-5 text-base lg:text-xl">
                  {[
                    "시장 반응을 빠르게 테스트하고 싶은 신규 브랜드",
                    "초기 비용과 재고 부담을 줄이고 싶은 창업자",
                    "인플루언서·커머스 공동기획 제품을 준비하는 브랜드",
                    "기능성, 임상, 패키지까지 한 번에 상담이 필요한 고객",
                  ].map((text) => (
                    <p key={text} className="flex gap-3">
                      <span>✓</span>
                      <span>{text}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl lg:text-5xl font-bold mb-10 lg:mb-16">
              제조 진행절차
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
              {process.map((item, index) => (
                <div
                  key={item}
                  className="border rounded-2xl p-6 bg-white"
                >
                  <p className="text-gray-400 font-bold mb-6">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="text-xl font-bold">
                    {item}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}