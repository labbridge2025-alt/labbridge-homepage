import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="pt-28 lg:pt-40">
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 lg:py-24">
          <p className="text-sm sm:text-base lg:text-xl font-semibold text-gray-500 mb-4 lg:mb-6">
            ABOUT LABBRIDGE
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8 lg:mb-12">
            OEM · ODM 화장품 제조를
            <br className="hidden sm:block" />
            가장 쉽고 빠르게
          </h1>

          <p className="text-base sm:text-lg lg:text-2xl text-gray-600 leading-relaxed max-w-5xl">
            랩브릿지는 화장품 OEM·ODM 전문 기업으로, 브랜드 기획부터 제품
            개발, 생산, 품질 관리, 출고까지 화장품 제조 전 과정을 책임지는
            토탈 솔루션 파트너입니다. 고객의 아이디어를 경쟁력 있는 제품으로
            완성하기 위해 최적의 제조 솔루션을 제공합니다.
          </p>
        </section>

        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 lg:mb-16">
              LABBRIDGE SERVICE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
              {[
                "제형 개발",
                "용기 소싱",
                "부자재 제작",
                "원료 소싱",
                "임상 진행",
                "인허가 지원",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white p-6 lg:p-10 rounded-2xl border"
                >
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
                    {item}
                  </h3>

                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    화장품 제조에 필요한 서비스를 제공합니다.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}