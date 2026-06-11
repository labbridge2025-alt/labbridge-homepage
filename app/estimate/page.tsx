"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";

export default function EstimatePage() {
  const [formula, setFormula] = useState("");
  const [container, setContainer] = useState("");
  const [packageType, setPackageType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [country, setCountry] = useState("");
  const [containerDev, setContainerDev] = useState("함께 문의");
  const [packageDesign, setPackageDesign] = useState("함께 문의");
  const [responsible, setResponsible] = useState("보유");
  const [targetLink, setTargetLink] = useState("");
  const [memo, setMemo] = useState("");
  const [company, setCompany] = useState("");
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [file, setFile] = useState<File | null>(null);
  const formulas = ["스킨케어", "앰플", "크림", "클렌징폼", "바디", "헤어", "색조", "선케어"];
  const containers = ["튜브", "에어리스", "앰플병", "크림용기", "펌프", "미스트", "스틱", "쿠션"];
  const packages = ["단상자", "라벨", "실크인쇄", "박스+라벨", "금박", "은박", "스티커", "없음"];

return (
  <>
    <Header />
    <main className="pt-40 pb-40">
      <div className="max-w-6xl mx-auto px-10">
        <h1 className="text-4xl font-bold text-center mb-16">상담문의</h1>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-3">제품 문의</h2>
          <p className="font-bold mb-5">내가 선택한 제품</p>

          <div className="border rounded-xl p-5 bg-gray-50">
            제형: {formula || "-"} / 용기: {container || "-"} / 패키지: {packageType || "-"}
          </div>
        </section>

        <div className="space-y-6">
                    <FormRow label="회사명" required>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="회사명 또는 브랜드명"
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>

          <FormRow label="담당자명" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="담당자 성함"
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>

          <FormRow label="연락처" required>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>

          <FormRow label="이메일" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>
          <FormRow label="제형 선택" required>
            <ChipGroup items={formulas} selected={formula} onSelect={setFormula} />
          </FormRow>

          <FormRow label="용기 선택">
            <ChipGroup items={containers} selected={container} onSelect={setContainer} />
          </FormRow>

          <FormRow label="패키지 선택">
            <ChipGroup items={packages} selected={packageType} onSelect={setPackageType} />
          </FormRow>

          <FormRow label="희망 출고 예정일" required>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>

          <FormRow label="생산 예정 수량" required>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">선택</option>
              <option>1,000개</option>
              <option>3,000개</option>
              <option>5,000개</option>
              <option>10,000개+</option>
            </select>
          </FormRow>

          <FormRow label="제조 희망 예산" required>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">금액 선택</option>
              <option>500만원 이하</option>
              <option>500~1,000만원</option>
              <option>1,000~3,000만원</option>
              <option>3,000만원+</option>
              <option>미확정</option>
            </select>
          </FormRow>

          <FormRow label="판매 예정 국가">
            <ChipGroup
              items={["대한민국", "미국", "일본", "유럽", "기타"]}
              selected={country}
              onSelect={setCountry}
            />
          </FormRow>

          <FormRow label="용기 개발 여부">
            <RadioGroup
              name="containerDev"
              items={["함께 문의", "별도 진행 예정"]}
              selected={containerDev}
              onSelect={setContainerDev}
            />
          </FormRow>

          <FormRow label="패키지 디자인">
            <RadioGroup
              name="packageDesign"
              items={["함께 문의", "별도 진행 예정"]}
              selected={packageDesign}
              onSelect={setPackageDesign}
            />
          </FormRow>

          <FormRow label="책임판매업 여부">
            <RadioGroup
              name="responsible"
              items={["보유", "대행 필요"]}
              selected={responsible}
              onSelect={setResponsible}
            />
          </FormRow>

          <FormRow label="제품 타겟 링크">
            <input
              type="url"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
              placeholder="타겟이 있다면 링크를 남겨주세요"
              className="w-full border rounded-xl px-4 py-3"
            />
          </FormRow>

          <FormRow label="문의사항" required>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="원하는 제형/사용감/개발 방향/요구사항 등을 적어주세요"
              className="w-full border rounded-xl px-4 py-3 h-40"
            />
          </FormRow>
          <FormRow label="첨부파일">
  <div className="flex items-center gap-4">
    <label className="border px-6 py-3 rounded cursor-pointer hover:bg-gray-100">
      파일 선택

      <input
        type="file"
        className="hidden"
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
      />
    </label>

    <span className="text-gray-500">
      {file ? file.name : "선택된 파일 없음"}
    </span>
  </div>
</FormRow>
        </div>

        <div className="mt-12 border-t pt-10">
          <button
           onClick={() => {
  if (!company || !name || !phone || !email) {
    alert("회사명, 담당자명, 연락처, 이메일을 입력해주세요.");
    return;
  }

  addDoc(collection(db, "inquiries"), {
    company,
    name,
    phone,
    email,
    formula,
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
    fileName: file ? file.name : "",
    createdAt: serverTimestamp(),
  }).catch((error) => {
    console.error("Firebase 저장 실패:", error);
  });

  alert(
    "문의가 정상적으로 접수되었습니다.\n\n영업일 기준 1~3일 이내에 담당자가 연락드릴 예정입니다."
  );

  window.open("https://pf.kakao.com/_DXxcxon/chat", "_blank");
}}
            className="w-full bg-black text-white py-5 text-xl font-bold rounded-xl"
          >
            견적 요청하기
          </button>
        </div>
      </div>
    </main>
  </>
  );
}

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
    <div className="grid grid-cols-[220px_1fr] gap-6 items-start">
      <div className="font-bold pt-3">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ChipGroup({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className={`border rounded-full px-5 py-3 ${
            selected === item ? "bg-black text-white" : "bg-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function RadioGroup({
  name,
  items,
  selected,
  onSelect,
}: {
  name: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <label key={item} className="border rounded-full px-5 py-3 flex gap-2 items-center">
          <input
            type="radio"
            name={name}
            checked={selected === item}
            onChange={() => onSelect(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
