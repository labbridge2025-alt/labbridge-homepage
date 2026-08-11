"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";

export default function EstimatePage() {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // 다중 선택
  const [formula, setFormula] = useState<string[]>([]);
  const [container, setContainer] = useState<string[]>([]);
  const [packageType, setPackageType] = useState<string[]>([]);

  // 기타 제형 직접 입력
  const [customFormula, setCustomFormula] = useState("");

  // 단일 선택 / 일반 입력
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [country, setCountry] = useState("");
  const [containerDev, setContainerDev] = useState("함께 문의");
  const [packageDesign, setPackageDesign] = useState("함께 문의");
  const [responsible, setResponsible] = useState("보유");
  const [targetLink, setTargetLink] = useState("");
  const [memo, setMemo] = useState("");

  // 고객 정보
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 파일
  const [file, setFile] = useState<File | null>(null);

  // 접수 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formulas = [
    "스킨케어",
    "앰플",
    "크림",
    "클렌징폼",
    "바디",
    "헤어",
    "색조",
    "선케어",
    "기타",
  ];

  const containers = [
    "튜브",
    "에어리스",
    "앰플병",
    "크림용기",
    "펌프",
    "미스트",
    "스틱",
    "쿠션",
  ];

  const packages = [
    "단상자",
    "라벨",
    "실크인쇄",
    "아웃박스",
    "금박",
    "은박",
    "코팅",
    "없음",
  ];

  // 관심상품 불러오기
  useEffect(() => {
    const loadWishProducts = async () => {
      try {
        const saved = localStorage.getItem("labbridge-wish");

        if (!saved) return;

        const ids: string[] = JSON.parse(saved);

        const selectedItems = await Promise.all(
          ids.map(async (id) => {
            // 제형
            const productSnap = await getDoc(
              doc(db, "products", id)
            );

            if (productSnap.exists()) {
              const data: any = productSnap.data();

              return {
                id: productSnap.id,
                type: "제형",
                name: data.name || "",
                category: data.category || "",
                moq: data.moq || "",
                unitPrice: data.unitPrice || "",
                image: data.image || "",
              };
            }

            // 용기
            const containerSnap = await getDoc(
              doc(db, "containers", id)
            );

            if (containerSnap.exists()) {
              const data: any = containerSnap.data();

              return {
                id: containerSnap.id,
                type: "용기",
                name: data.name || "",
                category: data.categoryName || "",
                moq: data.moq || "",
                unitPrice: "",
                image: data.imageUrl || "",
              };
            }

            // 패키지
            const packageSnap = await getDoc(
              doc(db, "packages", id)
            );

            if (packageSnap.exists()) {
              const data: any = packageSnap.data();

              return {
                id: packageSnap.id,
                type: "패키지",
                name: data.name || "",
                category: data.categoryName || "",
                moq: data.moq || "",
                unitPrice: "",
                image: data.imageUrl || "",
              };
            }

            return null;
          })
        );

        setSelectedProducts(
          selectedItems.filter(Boolean)
        );
      } catch (error) {
        console.error(
          "관심상품 불러오기 실패:",
          error
        );
      }
    };

    loadWishProducts();
  }, []);

  // 견적 문의 제출
  const submitInquiry = async () => {
    // 기본 필수값
    if (!company || !name || !phone || !email) {
      alert(
        "회사명, 담당자명, 연락처, 이메일을 입력해주세요."
      );
      return;
    }

    // 제형 필수
    if (formula.length === 0) {
      alert("제형을 1개 이상 선택해주세요.");
      return;
    }

    // 기타 제형 입력 확인
    if (
      formula.includes("기타") &&
      !customFormula.trim()
    ) {
      alert("기타 제형을 직접 입력해주세요.");
      return;
    }

    if (!dueDate) {
      alert("희망 출고 예정일을 선택해주세요.");
      return;
    }

    if (!quantity) {
      alert("생산 예정 수량을 선택해주세요.");
      return;
    }

    if (!budget) {
      alert("제조 희망 예산을 선택해주세요.");
      return;
    }

    if (!memo.trim()) {
      alert("문의사항을 입력해주세요.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      let fileName = "";
      let fileUrl = "";
      let filePath = "";

      // 첨부파일 업로드
      if (file) {
        const storage = getStorage();

        const safeFileName = file.name.replace(
          /[^a-zA-Z0-9가-힣._-]/g,
          "_"
        );

        filePath = `inquiries/${Date.now()}_${safeFileName}`;

        const storageRef = ref(
          storage,
          filePath
        );

        await uploadBytes(
          storageRef,
          file
        );

        fileUrl =
          await getDownloadURL(storageRef);

        fileName = file.name;
      }

      // 기타 제형을 실제 입력값으로 변환
      const finalFormula = formula.map(
        (item) =>
          item === "기타"
            ? customFormula.trim()
            : item
      );

      await addDoc(
        collection(db, "inquiries"),
        {
          company,
          name,
          phone,
          email,

          selectedProducts:
            selectedProducts.map(
              (item) => ({
                id: item.id,
                type: item.type || "",
                name: item.name || "",
                category:
                  item.category || "",
                moq: item.moq || "",
                unitPrice:
                  item.unitPrice || "",
                image: item.image || "",
              })
            ),

          // 여러 개 선택한 값은 배열로 저장
          formula: finalFormula,
          container,
          packageType,

          quantity,
          budget,
          dueDate,
          country,
          containerDev,
          packageDesign,
          responsible,
          targetLink,
          memo,

          fileName,
          fileUrl,
          filePath,

          status: "신규",
          assignedTo: "",
          adminMemo: "",

          createdAt:
            serverTimestamp(),
        }
      );

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "견적 문의 등록 실패:",
        error
      );

      alert(
        "견적 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 접수 완료 화면
  if (submitted) {
    return (
      <>
        <Header />

        <main className="min-h-[75vh] flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-xl">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-black text-white flex items-center justify-center text-4xl">
              ✓
            </div>

            <h1 className="text-4xl font-bold mb-5">
              견적 요청이 완료되었습니다.
            </h1>

            <p className="text-gray-600 text-lg leading-8">
              문의해 주셔서 감사합니다.
              <br />
              보내주신 내용을 확인한 후
              <br />
              <strong className="text-black">
                영업일 기준 3일 이내
              </strong>
              에 담당자가 답변드리겠습니다.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/";
                }}
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold"
              >
                홈으로 돌아가기
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "https://pf.kakao.com/_DXxcxon/chat",
                    "_blank"
                  );
                }}
                className="w-full sm:w-auto bg-[#FEE500] text-black px-8 py-4 rounded-xl font-bold"
              >
                카카오 상담하기
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-40 pb-40">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <h1 className="text-4xl font-bold text-center mb-16">
            상담문의
          </h1>

          {/* 관심상품 */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-3">
              제품 문의
            </h2>

            <p className="font-bold mb-5">
              내가 선택한 제품
            </p>

            {selectedProducts.length >
            0 ? (
              <div className="border rounded-2xl p-5 bg-gray-50 space-y-3">
                {selectedProducts.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b last:border-b-0 pb-3 last:pb-0"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      )}

                      <div>
                        <p className="font-bold">
                          [{item.type}]{" "}
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.category}
                          {item.moq
                            ? ` / MOQ ${item.moq}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="border rounded-xl p-5 bg-gray-50 text-gray-500">
                관심상품에 담긴 제품이
                없습니다.
              </div>
            )}
          </section>

          <div className="space-y-6">
            {/* 회사명 */}
            <FormRow
              label="회사명"
              required
            >
              <input
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(
                    e.target.value
                  )
                }
                placeholder="회사명 또는 브랜드명"
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 담당자 */}
            <FormRow
              label="담당자명"
              required
            >
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="담당자 성함"
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 연락처 */}
            <FormRow
              label="연락처"
              required
            >
              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="010-0000-0000"
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 이메일 */}
            <FormRow
              label="이메일"
              required
            >
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="example@email.com"
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 제형 - 다중 선택 */}
            <FormRow
              label="제형 선택"
              required
            >
              <div className="space-y-3">
                <MultiChipGroup
                  items={formulas}
                  selected={formula}
                  onSelect={
                    setFormula
                  }
                />

                {formula.includes(
                  "기타"
                ) && (
                  <input
                    type="text"
                    value={
                      customFormula
                    }
                    onChange={(e) =>
                      setCustomFormula(
                        e.target.value
                      )
                    }
                    placeholder="원하시는 제형을 직접 입력해주세요."
                    className="w-full border-b border-black px-1 py-3 outline-none"
                  />
                )}
              </div>
            </FormRow>

            {/* 용기 - 다중 선택 */}
            <FormRow label="용기 선택">
              <MultiChipGroup
                items={containers}
                selected={container}
                onSelect={
                  setContainer
                }
              />
            </FormRow>

            {/* 패키지 - 다중 선택 */}
            <FormRow label="후가공 선택">
              <MultiChipGroup
                items={packages}
                selected={packageType}
                onSelect={
                  setPackageType
                }
              />
            </FormRow>

            {/* 출고일 */}
            <FormRow
              label="희망 출고 예정일"
              required
            >
              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 생산수량 */}
            <FormRow
              label="생산 예정 수량"
              required
            >
              <select
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">
                  선택
                </option>
                <option>
                  1,000개
                </option>
                <option>
                  3,000개
                </option>
                <option>
                  5,000개
                </option>
                <option>
                  10,000개+
                </option>
              </select>
            </FormRow>

            {/* 예산 */}
            <FormRow
              label="제조 희망 예산"
              required
            >
              <select
                value={budget}
                onChange={(e) =>
                  setBudget(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">
                  금액 선택
                </option>

                <option>
                  500만원 이하
                </option>

                <option>
                  500~1,000만원
                </option>

                <option>
                  1,000~3,000만원
                </option>

                <option>
                  3,000만원+
                </option>

                <option>
                  미확정
                </option>
              </select>
            </FormRow>

            {/* 판매국가 - 단일 선택 */}
            <FormRow label="판매 예정 국가">
              <SingleChipGroup
                items={[
                  "대한민국",
                  "미국",
                  "일본",
                  "유럽",
                  "기타",
                ]}
                selected={country}
                onSelect={
                  setCountry
                }
              />
            </FormRow>

            {/* 용기개발 */}
            <FormRow label="용기 개발 여부">
              <RadioGroup
                name="containerDev"
                items={[
                  "함께 문의",
                  "별도 진행 예정",
                ]}
                selected={
                  containerDev
                }
                onSelect={
                  setContainerDev
                }
              />
            </FormRow>

            {/* 패키지 디자인 */}
            <FormRow label="패키지 디자인">
              <RadioGroup
                name="packageDesign"
                items={[
                  "함께 문의",
                  "별도 진행 예정",
                ]}
                selected={
                  packageDesign
                }
                onSelect={
                  setPackageDesign
                }
              />
            </FormRow>

            {/* 책임판매업 */}
            <FormRow label="책임판매업 여부">
              <RadioGroup
                name="responsible"
                items={[
                  "보유",
                  "대행 필요",
                ]}
                selected={
                  responsible
                }
                onSelect={
                  setResponsible
                }
              />
            </FormRow>

            {/* 타겟 링크 */}
            <FormRow label="제품 타겟 링크">
              <input
                type="url"
                value={targetLink}
                onChange={(e) =>
                  setTargetLink(
                    e.target.value
                  )
                }
                placeholder="타겟이 있다면 링크를 남겨주세요"
                className="w-full border rounded-xl px-4 py-3"
              />
            </FormRow>

            {/* 문의사항 */}
            <FormRow
              label="문의사항"
              required
            >
              <textarea
                value={memo}
                onChange={(e) =>
                  setMemo(e.target.value)
                }
                placeholder="원하는 제형/사용감/개발 방향/요구사항 등을 적어주세요"
                className="w-full border rounded-xl px-4 py-3 h-40"
              />
            </FormRow>

            {/* 첨부파일 */}
            <FormRow label="첨부파일">
              <div className="flex items-center gap-4">
                <label className="border px-6 py-3 rounded cursor-pointer hover:bg-gray-100">
                  파일 선택

                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFile(
                        e.target.files
                          ? e.target
                              .files[0]
                          : null
                      )
                    }
                  />
                </label>

                <span className="text-gray-500 break-all">
                  {file
                    ? file.name
                    : "선택된 파일 없음"}
                </span>
              </div>
            </FormRow>
          </div>

          {/* 제출 */}
          <div className="mt-12 border-t pt-10">
            <button
              type="button"
              onClick={
                submitInquiry
              }
              disabled={
                isSubmitting
              }
              className="w-full bg-black text-white py-5 text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "접수 중..."
                : "견적 요청하기"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

/* --------------------------------
   FormRow
-------------------------------- */

function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-2 lg:gap-6 items-start">
      <div className="font-bold pt-0 lg:pt-3">
        {label}{" "}
        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </div>

      <div>{children}</div>
    </div>
  );
}

/* --------------------------------
   다중 선택
   제형 / 용기 / 패키지
-------------------------------- */

function MultiChipGroup({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string[];
  onSelect: (
    value: string[]
  ) => void;
}) {
  const [open, setOpen] =
    useState(false);

  const toggleItem = (
    item: string
  ) => {
    if (
      selected.includes(item)
    ) {
      onSelect(
        selected.filter(
          (value) =>
            value !== item
        )
      );
    } else {
      onSelect([
        ...selected,
        item,
      ]);
    }
  };

  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() =>
            setOpen(!open)
          }
          className="w-full flex items-center justify-between border-b border-black py-3 text-left"
        >
          <span
            className={
              selected.length > 0
                ? "font-semibold text-black"
                : "text-gray-400"
            }
          >
            {selected.length > 0
              ? selected.join(
                  ", "
                )
              : "선택해주세요"}
          </span>

          <span
            className={`text-lg transition-transform duration-300 ${
              open
                ? "rotate-180"
                : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            open
              ? "max-h-[700px] opacity-100 pt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {items.map(
              (item) => {
                const active =
                  selected.includes(
                    item
                  );

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      toggleItem(
                        item
                      )
                    }
                    className={`px-4 py-3 text-left rounded-lg text-sm transition ${
                      active
                        ? "bg-black text-white font-semibold"
                        : "bg-gray-50 text-black hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            className="mt-3 w-full rounded-lg border border-black py-3 text-sm font-bold"
          >
            선택 완료
          </button>
        </div>
      </div>

      {/* PC */}
      <div className="hidden md:flex flex-wrap gap-3">
        {items.map((item) => {
          const active =
            selected.includes(
              item
            );

          return (
            <button
              key={item}
              type="button"
              onClick={() =>
                toggleItem(item)
              }
              className={`border rounded-full px-5 py-3 ${
                active
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* --------------------------------
   단일 선택
   판매 예정 국가
-------------------------------- */

function SingleChipGroup({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (
    value: string
  ) => void;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* 모바일 */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() =>
            setOpen(!open)
          }
          className="w-full flex items-center justify-between border-b border-black py-3 text-left"
        >
          <span
            className={
              selected
                ? "font-semibold text-black"
                : "text-gray-400"
            }
          >
            {selected ||
              "선택해주세요"}
          </span>

          <span
            className={`text-lg transition-transform duration-300 ${
              open
                ? "rotate-180"
                : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            open
              ? "max-h-[500px] opacity-100 pt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            {items.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onSelect(
                      item
                    );
                    setOpen(
                      false
                    );
                  }}
                  className={`px-4 py-3 text-left rounded-lg text-sm ${
                    selected ===
                    item
                      ? "bg-black text-white font-semibold"
                      : "bg-gray-50 text-black"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden md:flex flex-wrap gap-3">
        {items.map(
          (item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                onSelect(item)
              }
              className={`border rounded-full px-5 py-3 ${
                selected ===
                item
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>
    </>
  );
}

/* --------------------------------
   라디오
-------------------------------- */

function RadioGroup({
  name,
  items,
  selected,
  onSelect,
}: {
  name: string;
  items: string[];
  selected: string;
  onSelect: (
    value: string
  ) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <label
          key={item}
          className="border rounded-full px-5 py-3 flex gap-2 items-center"
        >
          <input
            type="radio"
            name={name}
            checked={
              selected === item
            }
            onChange={() =>
              onSelect(item)
            }
          />

          {item}
        </label>
      ))}
    </div>
  );
}