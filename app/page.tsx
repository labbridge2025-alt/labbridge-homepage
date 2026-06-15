import Header from "@/components/Header";


export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="min-h-screen flex items-center justify-center px-5 sm:px-8 lg:px-6 pt-24">
          <div className="text-center">
            <p className="mb-6 lg:mb-8 text-lg sm:text-xl lg:text-[28px] font-medium">
              LABBRIDGE COSMETIC PLATFORM
            </p>

            <h1 className="text-[64px] sm:text-[110px] lg:text-[220px] font-bold leading-none tracking-tight">
              LABBRIDGE
            </h1>

            <p className="mt-8 lg:mt-12 text-2xl sm:text-3xl lg:text-[46px] font-medium">
              화장품 제조의 시작부터 출시까지
            </p>

            <a
              href="/estimate"
              className="mt-10 lg:mt-16 inline-block px-8 lg:px-20 py-4 lg:py-8 bg-black text-white rounded text-lg lg:text-[30px] font-semibold"
            >
              제조 문의하기
            </a>
          </div>
        </section>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-lg lg:text-2xl font-semibold">
              <div>01 상담</div>
              <div>02 견적</div>
              <div>03 샘플</div>
              <div>04 생산</div>
              <div>05 출고</div>
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

            <div className="h-[280px] lg:h-[500px] bg-gray-200 flex items-center justify-center text-xl lg:text-3xl font-bold text-gray-500">
              IMAGE AREA
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-40 px-5 sm:px-8 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 lg:mb-20">
              <div>
                <p className="text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
                  PORTFOLIO
                </p>

                <h2 className="text-4xl lg:text-6xl font-bold">
                  제조 사례
                </h2>
              </div>

              <a href="/portfolio" className="text-lg lg:text-2xl font-semibold">
                VIEW MORE →
              </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {["스킨케어", "앰플", "크림", "클렌징폼"].map((item) => (
                <div key={item} className="bg-white">
                  <div className="h-[180px] lg:h-[360px] bg-gray-200 flex items-center justify-center text-lg lg:text-2xl text-gray-500">
                    IMAGE
                  </div>

                  <div className="p-4 lg:p-8">
                    <h3 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-3">
                      {item}
                    </h3>

                    <p className="text-sm lg:text-xl text-gray-600">
                      OEM / ODM 제조 사례
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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