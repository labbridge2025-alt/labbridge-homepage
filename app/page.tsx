import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="mb-8 text-[28px] font-medium">
              LABBRIDGE COSMETIC PLATFORM
            </p>

            <h1 className="text-[220px] font-bold leading-none tracking-tight">
              LABBRIDGE
            </h1>

            <p className="mt-12 text-[46px] font-medium">
              화장품 제조의 시작부터 출시까지
            </p>

            <a
  href="/estimate"
  className="mt-16 inline-block px-20 py-8 bg-black text-white rounded text-[30px] font-semibold"
>
  제조 문의하기
</a>
          </div>
        </section>

        <section className="py-40 px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl font-bold mb-20">SERVICE</h2>

            <div className="grid grid-cols-3 gap-10">
              {["제형", "용기", "부자재", "원료", "임상", "인허가"].map((item) => (
                <div key={item} className="border p-10">
                  <h3 className="text-3xl font-bold mb-4">{item}</h3>
                  <p>화장품 제조에 필요한 항목을 상담합니다.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-40 px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl font-bold mb-20">PROCESS</h2>

            <div className="grid grid-cols-5 gap-8 text-2xl font-semibold">
              <div>01 상담</div>
              <div>02 견적</div>
              <div>03 샘플</div>
              <div>04 생산</div>
              <div>05 출고</div>
            </div>
          </div>
        </section>

        <section className="py-40 px-20 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-2xl font-semibold mb-6">ABOUT LABBRIDGE</p>
              <h2 className="text-6xl font-bold leading-tight mb-10">
                브랜드와 제조사를
                <br />
                연결하는 화장품 제조 플랫폼
              </h2>
              <p className="text-2xl leading-relaxed text-gray-600">
                랩브릿지는 제형, 용기, 부자재, 원료, 임상 및 인허가까지
                화장품 제조에 필요한 과정을 한 번에 연결합니다.
              </p>
            </div>

            <div className="h-[500px] bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
              IMAGE AREA
            </div>
          </div>
        </section>
        <section className="py-40 px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-20">
              <div>
                <p className="text-2xl font-semibold mb-6">PORTFOLIO</p>
                <h2 className="text-6xl font-bold">제조 사례</h2>
              </div>

              <a href="/portfolio" className="text-2xl font-semibold">
                VIEW MORE →
              </a>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {["스킨케어", "앰플", "크림", "클렌징폼"].map((item) => (
                <div key={item} className="bg-white">
                  <div className="h-[360px] bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                    IMAGE
                  </div>
                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-3">{item}</h3>
                    <p className="text-xl text-gray-600">
                      OEM / ODM 제조 사례
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-40 px-20 bg-black text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-2xl mb-6">CONTACT US</p>
              <h2 className="text-6xl font-bold">
                화장품 제조 상담이 필요하신가요?
              </h2>
            </div>

            <a
  href="https://pf.kakao.com/_DXxcxon"
  target="_blank"
  rel="noopener noreferrer"
  className="px-16 py-8 border border-white text-3xl font-semibold"
>
  문의하기
</a>
          </div>
        </section>
           </main>

      <footer className="py-16 px-20 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            LABBRIDGE
          </h2>

          <p>주식회사 스킨랩</p>
          <p>주소: 인천광역시 연수구 센트럴로 263, IBS타워 2409호</p>
          <p>E-mail: skinlab@labbridge.co.kr</p>
          <p>사업자등록번호: 633-88-03616</p>
        </div>
      </footer>

    </>
  );
}
