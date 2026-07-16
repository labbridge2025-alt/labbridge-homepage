import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FlaskConical,
  MessageSquareText,
  Package,
  Palette,
  Truck,
} from "lucide-react";

const concerns = [
  {
    number: "01",
    title: "어떤 제품부터 시작해야 할지 막막해요.",
    description:
      "아이디어는 있지만 제품 유형과 개발 방향을 정하기 어려운 경우가 많습니다.",
  },
  {
    number: "02",
    title: "제형과 용기를 어떻게 골라야 할지 모르겠어요.",
    description:
      "사용감뿐만 아니라 충진 방식과 용기 적합성까지 함께 검토해야 합니다.",
  },
  {
    number: "03",
    title: "예산과 최소 생산 수량이 부담돼요.",
    description:
      "목표 수량과 예산 안에서 진행 가능한 제조 방향을 정리해 드립니다.",
  },
  {
    number: "04",
    title: "시험과 표시 문구가 너무 복잡해요.",
    description:
      "제품 콘셉트에 필요한 시험과 표시 사항을 단계별로 검토합니다.",
  },
];

const processSteps = [
  {
    step: "STEP 01",
    title: "상담 및 제품 방향 설정",
    description:
      "만들고 싶은 제품과 타깃, 사용감, 예상 수량, 예산을 확인합니다. 아직 구체적인 제형이 정해지지 않았더라도 제품의 방향부터 함께 정리할 수 있습니다.",
    details: [
      "제품 유형 및 핵심 콘셉트 확인",
      "타깃 고객과 판매 채널 검토",
      "예상 수량·예산·출시 일정 정리",
    ],
    image: "/process/process-step-01.png",
    imageAlt: "화장품 제품 개발 상담",
    icon: MessageSquareText,
  },
  {
    step: "STEP 02",
    title: "제형 및 용기 제안",
    description:
      "원하는 사용감과 기능, 판매 가격대를 고려해 적합한 제형을 검토합니다. 내용물의 특성과 충진 방식에 맞는 용기와 부자재도 함께 제안합니다.",
    details: [
      "제형 후보 및 사용감 제안",
      "내용물과 용기의 적합성 검토",
      "용기·캡·펌프·단상자 구성 제안",
    ],
    image: "/process/process-step-02.png",
    imageAlt: "화장품 제형과 용기 검토",
    icon: FlaskConical,
  },
  {
    step: "STEP 03",
    title: "샘플 및 디자인 개발",
    description:
      "선정한 방향에 맞춰 샘플을 개발하고 사용감과 향, 색상 등을 조정합니다. 동시에 용기 인쇄와 라벨, 단상자 디자인을 구체화합니다.",
    details: [
      "1차 샘플 제작 및 피드백",
      "사용감·향·색상 수정",
      "용기 인쇄 및 패키지 디자인 진행",
    ],
    image: "/process/process-step-03.png",
    imageAlt: "화장품 샘플과 패키지 디자인",
    icon: Palette,
  },
  {
    step: "STEP 04",
    title: "시험 및 생산 준비",
    description:
      "확정된 제품을 기준으로 필요한 시험과 기능성 여부를 검토합니다. 생산 전에 표시 문구와 인쇄 데이터, 부자재 입고 일정도 함께 확인합니다.",
    details: [
      "안정성·미생물·용기 적합성 검토",
      "기능성 및 임상 항목 확인",
      "표시 문구와 최종 인쇄 데이터 검수",
    ],
    image: "/process/process-step-04.png",
    imageAlt: "화장품 시험과 생산 준비",
    icon: Package,
  },
  {
    step: "STEP 05",
    title: "생산 및 출고",
    description:
      "원료와 부자재 입고 후 본생산을 진행합니다. 충진과 포장, 품질 검사를 거쳐 제품이 안전하게 출고될 수 있도록 전체 일정을 관리합니다.",
    details: [
      "원료 및 부자재 입고 확인",
      "충진·포장·완제품 검사",
      "출고 일정 및 납품 관리",
    ],
    image: "/process/process-step-05.png",
    imageAlt: "화장품 생산과 출고",
    icon: Truck,
  },
];

export default function ProcessPage() {
  return (
    <main className="overflow-hidden bg-white text-[#111111]">
      {/* HERO */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:min-h-[760px] lg:grid-cols-2">
          <div className="flex items-center px-5 pb-14 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-16 lg:py-24 xl:px-24">
            <div className="max-w-[650px]">
              <p className="mb-5 text-[12px] font-semibold tracking-[0.18em] text-neutral-500 sm:mb-8 sm:text-sm">
                LABBRIDGE PROCESS
              </p>

              <h1 className="text-[36px] font-bold leading-[1.18] tracking-[-0.05em] sm:text-[52px] lg:text-[66px] xl:text-[74px]">
                아이디어가
                <br />
                제품이 되는 과정
              </h1>

              <p className="mt-6 max-w-[590px] break-keep text-[15px] leading-[1.75] text-neutral-600 sm:mt-8 sm:text-[18px] sm:leading-[1.9]">
                제품 기획부터 제형, 용기, 디자인, 시험, 생산까지.
                <br className="hidden sm:block" />
                복잡한 화장품 제조 과정을 하나의 흐름으로 연결합니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-2 sm:mt-12 sm:gap-3">
                <Link
                  href="/estimate"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-5 text-[13px] font-semibold text-white transition hover:bg-neutral-800 sm:h-14 sm:gap-3 sm:px-7 sm:text-sm"
                >
                  제조 문의하기
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/portfolio"
                  className="inline-flex h-12 items-center rounded-full border border-black/25 px-5 text-[13px] font-semibold transition hover:bg-neutral-100 sm:h-14 sm:px-7 sm:text-sm"
                >
                  포트폴리오 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="relative h-[320px] sm:h-[460px] lg:h-auto lg:min-h-full">
            <Image
              src="/process/process-hero.png"
              alt="랩브릿지 화장품 제조 진행절차"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* CONCERNS */}
      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-10 text-center sm:mb-16 lg:mb-20">
            <p className="mb-4 text-[12px] font-semibold tracking-[0.16em] text-neutral-500 sm:mb-5 sm:text-sm">
              BEFORE WE START
            </p>

            <h2 className="break-keep text-[29px] font-bold leading-[1.3] tracking-[-0.045em] sm:text-[42px] lg:text-[48px]">
              제품 개발, 어디서부터 시작해야 할까요?
            </h2>

            <p className="mx-auto mt-4 max-w-[670px] break-keep text-[15px] leading-[1.75] text-neutral-600 sm:mt-6 sm:text-[17px] sm:leading-[1.8]">
              화장품 제조는 제형 하나만 정한다고 끝나지 않습니다.
              <br className="hidden sm:block" />
              랩브릿지는 브랜드가 실제로 막히는 지점부터 함께 정리합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-black/15 md:grid-cols-2 lg:grid-cols-4">
            {concerns.map((item) => (
              <article
                key={item.number}
                className="border-b border-r border-black/15 p-6 transition duration-300 hover:bg-[#f7f7f5] sm:min-h-[280px] sm:p-8 lg:min-h-[330px] lg:p-9"
              >
                <p className="text-[12px] font-semibold text-neutral-400 sm:text-sm">
                  {item.number}
                </p>

                <h3 className="mt-7 break-keep text-[19px] font-bold leading-[1.45] tracking-[-0.03em] sm:mt-12 sm:text-[21px] lg:mt-16 lg:text-[22px]">
                  {item.title}
                </h3>

                <p className="mt-4 break-keep text-[14px] leading-[1.7] text-neutral-600 sm:mt-5 sm:text-[15px] sm:leading-[1.75]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS INTRO */}
      <section className="bg-[#111111] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-10 lg:py-36">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 sm:gap-12 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 text-[12px] font-semibold tracking-[0.16em] text-white/50 sm:mb-7 sm:text-sm">
              HOW WE WORK
            </p>

            <h2 className="text-[34px] font-bold leading-[1.2] tracking-[-0.05em] sm:text-[50px] lg:text-[64px]">
              하나의 제품을 위해
              <br />
              필요한 다섯 단계
            </h2>
          </div>

          <p className="max-w-[490px] break-keep text-[15px] leading-[1.8] text-white/65 sm:text-[17px] sm:leading-[1.9]">
            각 단계마다 필요한 업체를 따로 알아보지 않아도 됩니다. 상담부터
            출고까지 전담 담당자가 진행 상황을 연결하고 관리합니다.
          </p>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section>
        {processSteps.map((item, index) => {
          const Icon = item.icon;
          const isReversed = index % 2 === 1;

          return (
            <article
              key={item.step}
              className="border-b border-black/10 bg-white"
            >
              <div
                className={`mx-auto grid max-w-[1600px] grid-cols-1 lg:min-h-[760px] lg:grid-cols-2 ${
                  isReversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative h-[300px] overflow-hidden sm:h-[420px] lg:h-auto lg:min-h-full">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur sm:left-10 sm:top-10 sm:h-14 sm:w-14">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="sm:h-[23px] sm:w-[23px]"
                    />
                  </div>
                </div>

                <div className="flex items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-24">
                  <div className="max-w-[570px]">
                    <p className="text-[12px] font-bold tracking-[0.14em] text-neutral-400 sm:text-sm">
                      {item.step}
                    </p>

                    <h2 className="mt-4 break-keep text-[31px] font-bold leading-[1.28] tracking-[-0.045em] sm:mt-6 sm:text-[42px] lg:mt-7 lg:text-[50px]">
                      {item.title}
                    </h2>

                    <p className="mt-5 break-keep text-[15px] leading-[1.8] text-neutral-600 sm:mt-7 sm:text-[17px] sm:leading-[1.9]">
                      {item.description}
                    </p>

                    <div className="mt-7 border-t border-black/15 sm:mt-10">
                      {item.details.map((detail) => (
                        <div
                          key={detail}
                          className="flex items-start gap-3 border-b border-black/15 py-4 sm:gap-4 sm:py-5"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                            <Check size={12} strokeWidth={2.5} />
                          </span>

                          <p className="break-keep text-[14px] font-medium leading-[1.6] text-neutral-700 sm:text-[15px]">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#f3f3f0] px-4 py-14 sm:px-8 sm:py-24 lg:px-10 lg:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid overflow-hidden rounded-[20px] bg-white sm:rounded-[28px] lg:grid-cols-[1fr_0.78fr] lg:rounded-[32px]">
            <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <p className="text-[12px] font-semibold tracking-[0.16em] text-neutral-500 sm:text-sm">
                START YOUR PROJECT
              </p>

              <h2 className="mt-5 text-[31px] font-bold leading-[1.28] tracking-[-0.045em] sm:mt-7 sm:text-[44px] lg:text-[52px]">
                만들고 싶은 제품을
                <br />
                말씀해주세요.
              </h2>

              <p className="mt-5 max-w-[550px] break-keep text-[15px] leading-[1.8] text-neutral-600 sm:mt-7 sm:text-[17px]">
                제형이나 용기가 아직 정해지지 않아도 괜찮습니다. 현재 준비된
                내용과 목표 일정에 맞춰 필요한 개발 과정을 안내합니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
                <Link
                  href="/estimate"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-5 text-[13px] font-semibold text-white transition hover:bg-neutral-800 sm:h-14 sm:gap-3 sm:px-7 sm:text-sm"
                >
                  제조 문의 남기기
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="https://pf.kakao.com/_DXxcxon/chat"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full border border-black/20 px-5 text-[13px] font-semibold transition hover:bg-neutral-100 sm:h-14 sm:px-7 sm:text-sm"
                >
                  카카오톡 상담
                </a>
              </div>
            </div>

            <div className="relative h-[280px] sm:h-[380px] lg:h-auto lg:min-h-full">
              <Image
                src="/process/process-cta.png"
                alt="랩브릿지 화장품 제조 상담"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}