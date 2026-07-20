"use client";

import { useState, type ReactNode } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMatching, setAgreeMatching] = useState(false);
  const [agreeNoBypass, setAgreeNoBypass] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);
  const [agreeKakao, setAgreeKakao] = useState(false);

  const [verified, setVerified] = useState(false);
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [passwordConfirm, setPasswordConfirm] = useState("");

const [signupLoading, setSignupLoading] = useState(false);
  const requiredAgreed =
    agreeTerms && agreePrivacy && agreeMatching && agreeNoBypass && agreeAge;

  const toggleAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMatching(checked);
    setAgreeNoBypass(checked);
    setAgreeAge(checked);
    setAgreeEmail(checked);
    setAgreeSms(checked);
    setAgreeKakao(checked);
  };

 const handleNiceVerify = async () => {
  try {
    const popup = window.open(
      "",
      "niceVerification",
      "width=500,height=700,top=100,left=100"
    );

    if (!popup) {
      alert("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
      return;
    }

    popup.document.write(`
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        height:100vh;
        font-family:sans-serif;
      ">
        본인인증 창을 불러오는 중입니다.
      </div>
    `);

    const response = await fetch("/api/nice/auth", {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.authUrl) {
      popup.close();

      alert(
        data.message ||
          "본인인증 요청을 불러오지 못했습니다."
      );

      return;
    }

    /*
     * 다음 인증 결과 조회 단계에서 임시로 사용할 값
     */
    sessionStorage.setItem(
      "niceVerification",
      JSON.stringify({
        requestNo: data.requestNo,
        transactionId: data.transactionId,
        accessToken: data.accessToken,
        ticket: data.ticket,
        iterators: data.iterators,
      })
    );

    popup.location.href = data.authUrl;
  } catch (error) {
    console.error("NICE 본인인증 오류:", error);

    alert("본인인증 요청 중 오류가 발생했습니다.");
  }
};
const handleSignup = async () => {
  if (!name.trim()) {
    alert("성함을 입력해주세요.");
    return;
  }

  if (!phone.trim()) {
    alert("연락처를 입력해주세요.");
    return;
  }

  if (!email.trim()) {
    alert("이메일을 입력해주세요.");
    return;
  }

  if (password.length < 6) {
    alert("비밀번호는 6자 이상 입력해주세요.");
    return;
  }

  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    setSignupLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const uid = userCredential.user.uid;

    await setDoc(doc(db, "members", uid), {
      uid,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),

      role: "member",
      status: "active",

      agreements: {
        terms: agreeTerms,
        privacy: agreePrivacy,
        matching: agreeMatching,
        noBypass: agreeNoBypass,
        age: agreeAge,
        emailMarketing: agreeEmail,
        smsMarketing: agreeSms,
        kakaoMarketing: agreeKakao,
      },

      verified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setStep(4);
  } catch (error: unknown) {
    console.error("회원가입 실패:", error);

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String(error.code)
        : "";

    if (errorCode === "auth/email-already-in-use") {
      alert("이미 가입된 이메일입니다.");
      return;
    }

    if (errorCode === "auth/invalid-email") {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (errorCode === "auth/weak-password") {
      alert("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    alert("회원가입 중 오류가 발생했습니다.");
  } finally {
    setSignupLoading(false);
  }
};
  return (
    <main className="min-h-screen bg-white px-6 pt-36 pb-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-center text-3xl font-bold">회원가입</h1>

        <div className="mb-14 flex justify-center gap-4 text-sm font-bold">
          <span className={step === 1 ? "text-black" : "text-gray-300"}>01 약관동의</span>
          <span className="text-gray-300">|</span>
          <span className={step === 2 ? "text-black" : "text-gray-300"}>02 본인인증</span>
          <span className="text-gray-300">|</span>
          <span className={step === 3 ? "text-black" : "text-gray-300"}>03 정보입력</span>
          <span className="text-gray-300">|</span>
          <span className={step === 4 ? "text-black" : "text-gray-300"}>04 가입완료</span>
        </div>

        {step === 1 && (
          <section>
            <p className="mb-5 text-sm text-gray-500">
              일반 및 간편 회원가입 모두 약관 동의 절차가 필요합니다.
            </p>

            <label className="mb-6 flex items-center gap-3 text-lg font-bold">
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => toggleAll(e.target.checked)}
                className="h-5 w-5"
              />
              전체동의
            </label>

            <div className="border-t">
              <Agreement title="이용약관 동의" required checked={agreeTerms} onChange={setAgreeTerms}>
                <p>
                  본 서비스는 주식회사 스킨랩이 운영하는 랩브릿지(LABBRIDGE) 플랫폼으로,
                  화장품 OEM/ODM 제조 상담 및 제조사 매칭 서비스를 제공합니다.
                </p>
                <p>
                  회원은 본 서비스를 이용함에 있어 관련 법령 및 본 약관을 준수하여야 합니다.
                </p>
                <p>
                  회사는 회원의 요청에 따라 제조사 정보 제공, 제조 상담, 제조사 매칭 등의
                  서비스를 제공할 수 있으나 제조계약의 당사자가 아니며 제조사와 회원 간 계약의
                  체결, 생산, 납품, 품질 및 대금 지급 등에 대하여 책임을 부담하지 않습니다.
                </p>
                <p>
                  회원은 서비스를 통하여 제공받은 제조사 정보, 견적 정보, 상담 내용 등을 회사의
                  사전 승인 없이 제3자에게 제공하거나 공개할 수 없습니다.
                </p>
                <p>
                  회원은 회사의 사전 동의 없이 랩브릿지를 통해 알게 된 제조사와 직접 연락하거나
                  거래를 진행할 수 없습니다.
                </p>
                <p>
                  회원이 우회거래를 진행하거나 시도한 사실이 확인될 경우 회사는 회원 자격 제한,
                  서비스 이용 제한 등의 조치를 취할 수 있으며, 회사에 손해가 발생한 경우
                  손해배상을 청구할 수 있습니다.
                </p>
                <p>
                  회원은 가입 시 정확한 정보를 제공하여야 하며 허위 정보 입력 시 서비스 이용이
                  제한될 수 있습니다.
                </p>
              </Agreement>

              <Agreement title="개인정보 수집 및 이용 동의" required checked={agreePrivacy} onChange={setAgreePrivacy}>
                <p>
                  주식회사 스킨랩은 랩브릿지 서비스 제공을 위하여 아래와 같이 개인정보를 수집 및 이용합니다.
                </p>

                <div>
                  <p className="font-bold">■ 수집항목</p>
                  <ul className="list-disc pl-5">
                    <li>회사명</li>
                    <li>성함</li>
                    <li>연락처</li>
                    <li>이메일 주소</li>
                    <li>직책(선택)</li>
                    <li>문의 내용 및 상담 내용</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold">■ 수집목적</p>
                  <ul className="list-disc pl-5">
                    <li>회원 가입 및 회원 관리</li>
                    <li>본인 확인</li>
                    <li>OEM/ODM 제조 상담</li>
                    <li>제조사 매칭 서비스 제공</li>
                    <li>문의 응대 및 고객 지원</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold">■ 보유 및 이용기간</p>
                  <p>
                    회원 탈퇴 시까지 보관하며, 관련 법령에 따라 보관이 필요한 경우 해당 법령이
                    정한 기간 동안 보관합니다.
                  </p>
                </div>

                <div>
                  <p className="font-bold">■ 동의 거부 권리</p>
                  <p>
                    회원은 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
                    다만 필수항목 수집에 대한 동의를 거부할 경우 회원가입 및 서비스 이용이
                    제한될 수 있습니다.
                  </p>
                </div>
              </Agreement>

              <Agreement title="제조사 매칭 및 상담 진행 동의" required checked={agreeMatching} onChange={setAgreeMatching}>
                <p>
                  회원은 제조사 매칭 및 상담 진행을 위하여 회사가 회원이 제공한 정보를 검토하고
                  활용하는 것에 동의합니다.
                </p>
                <p>
                  회사는 회원의 제품 유형, 개발 목적, 생산 수량, 예산 및 기타 문의 내용을 검토하여
                  적합한 제조사를 추천하거나 상담을 진행할 수 있습니다.
                </p>
                <p>
                  회원은 제조사 매칭 결과가 특정 제조사와의 계약 체결을 보장하지 않음을 이해하고
                  이에 동의합니다.
                </p>
                <p>
                  회원과 제조사 간 상담 및 협의는 회사를 통하여 진행되는 것을 원칙으로 합니다.
                </p>
              </Agreement>

              <Agreement title="제조사 정보 보호 및 우회거래 금지 동의" required checked={agreeNoBypass} onChange={setAgreeNoBypass}>
                <p>
                  회원은 랩브릿지를 통해 제공받은 제조사 정보, 견적 정보, 상담 자료 및 기타 영업
                  정보를 회사의 사전 승인 없이 제3자에게 제공하거나 공개하지 않습니다.
                </p>
                <p>
                  회원은 랩브릿지를 통해 알게 된 제조사와 회사를 배제한 상태에서 직접 거래하거나
                  거래를 시도하지 않습니다.
                </p>
                <p>
                  회원은 제조사 연락처, 담당자 정보, 견적서, 개발 자료 등을 무단으로 복제, 배포
                  또는 활용하지 않습니다.
                </p>
                <p>
                  회원이 본 조항을 위반한 경우 회사는 서비스 이용 제한, 회원 자격 박탈 등의 조치를
                  취할 수 있으며, 회사에 발생한 손해에 대하여 배상을 청구할 수 있습니다.
                </p>
              </Agreement>

              <Agreement title="만 14세 이상 확인" required checked={agreeAge} onChange={setAgreeAge}>
                <p>본인은 만 14세 이상이며, 본인의 의사에 따라 회원가입을 진행함을 확인합니다.</p>
              </Agreement>

              <Agreement title="이메일 마케팅 수신 동의" checked={agreeEmail} onChange={setAgreeEmail}>
                <p>주식회사 스킨랩은 회원에게 이메일을 통하여 아래와 같은 정보를 제공할 수 있습니다.</p>
                <p className="font-bold">■ 발송 내용</p>
                <ul className="list-disc pl-5">
                  <li>신규 제조사 정보</li>
                  <li>OEM/ODM 개발 트렌드</li>
                  <li>신규 서비스 안내</li>
                  <li>이벤트 및 프로모션 안내</li>
                  <li>뉴스레터 및 마케팅 정보</li>
                </ul>
                <p>
                  회원은 이메일 마케팅 수신에 대한 동의를 거부할 권리가 있으며,
                  동의하지 않더라도 회원가입 및 서비스 이용에는 제한이 없습니다.
                </p>
                <p>회원은 언제든지 이메일 수신을 거부하거나 동의를 철회할 수 있습니다.</p>
              </Agreement>

              <Agreement title="SMS 마케팅 수신 동의" checked={agreeSms} onChange={setAgreeSms}>
                <p>주식회사 스킨랩은 회원에게 문자메시지(SMS)를 통하여 아래와 같은 정보를 제공할 수 있습니다.</p>
                <p className="font-bold">■ 발송 내용</p>
                <ul className="list-disc pl-5">
                  <li>이벤트 및 프로모션 안내</li>
                  <li>신규 서비스 안내</li>
                  <li>중요 공지사항</li>
                  <li>회원 대상 혜택 안내</li>
                </ul>
                <p>
                  회원은 SMS 마케팅 수신에 대한 동의를 거부할 권리가 있으며,
                  동의하지 않더라도 회원가입 및 서비스 이용에는 제한이 없습니다.
                </p>
                <p>회원은 언제든지 SMS 수신을 거부하거나 동의를 철회할 수 있습니다.</p>
              </Agreement>

              <Agreement title="카카오 알림톡 수신 동의" checked={agreeKakao} onChange={setAgreeKakao}>
                <p>
                  주식회사 스킨랩은 회원에게 카카오톡(알림톡, 친구톡 등)을 통하여 아래와 같은 정보를 제공할 수 있습니다.
                </p>
                <p className="font-bold">■ 발송 내용</p>
                <ul className="list-disc pl-5">
                  <li>신규 제조사 정보</li>
                  <li>OEM/ODM 개발 트렌드</li>
                  <li>신규 서비스 안내</li>
                  <li>이벤트 및 프로모션 안내</li>
                  <li>회원 대상 혜택 및 마케팅 정보</li>
                  <li>기타 회사가 제공하는 서비스 관련 정보</li>
                </ul>
                <p>
                  회원은 카카오톡 마케팅 정보 수신에 대한 동의를 거부할 권리가 있으며,
                  동의하지 않더라도 회원가입 및 서비스 이용에는 제한이 없습니다.
                </p>
                <p>회원은 언제든지 수신 거부 또는 동의 철회를 요청할 수 있습니다.</p>
                <p>
                  ※ 단, 제조 문의 접수, 상담 진행, 견적 안내, 서비스 이용 안내 등 거래 및 서비스
                  제공에 필수적인 정보는 마케팅 수신 동의 여부와 관계없이 발송될 수 있습니다.
                </p>
              </Agreement>
            </div>

            <button
              disabled={!requiredAgreed}
              onClick={() => setStep(2)}
              className={`mt-10 w-full rounded-xl py-4 font-bold ${
                requiredAgreed ? "bg-black text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              다음
            </button>
          </section>
        )}

        {step === 2 && (
  <section>
    <h2 className="mb-6 text-xl font-bold">
      휴대폰 본인인증
    </h2>

    <p className="mb-6 text-sm leading-6 text-gray-500">
      회원가입을 위해 본인 명의의 휴대폰으로 인증해주세요.
    </p>

    <button
      type="button"
      onClick={handleNiceVerify}
      className="h-16 w-full rounded-xl bg-black font-bold text-white"
    >
      휴대폰 본인인증
    </button>

    {verified && (
      <p className="mt-5 text-sm font-bold text-green-600">
        본인인증이 완료되었습니다.
      </p>
    )}

    <button
      type="button"
      disabled={!verified}
      onClick={() => setStep(3)}
      className={`mt-10 w-full rounded-xl py-4 font-bold ${
        verified
          ? "bg-black text-white"
          : "bg-gray-300 text-gray-500"
      }`}
    >
      다음
    </button>
  </section>
)}

        {step === 3 && (
  <section className="space-y-4">
    <Input
      placeholder="성함 *"
      value={name}
      onChange={setName}
    />

    <Input
      placeholder="연락처 *"
      value={phone}
      onChange={setPhone}
      inputMode="tel"
    />

    <Input
      placeholder="이메일 *"
      value={email}
      onChange={setEmail}
      type="email"
    />

    <Input
      placeholder="비밀번호 *"
      value={password}
      onChange={setPassword}
      type="password"
    />

    <Input
      placeholder="비밀번호 확인 *"
      value={passwordConfirm}
      onChange={setPasswordConfirm}
      type="password"
    />

    <button
      type="button"
      onClick={handleSignup}
      disabled={signupLoading}
      className={`mt-8 w-full rounded-xl py-4 font-bold ${
        signupLoading
          ? "cursor-not-allowed bg-gray-300 text-gray-500"
          : "bg-black text-white"
      }`}
    >
      {signupLoading ? "가입 처리 중..." : "회원가입"}
    </button>
  </section>
)}

        {step === 4 && (
          <section className="text-center">
            <h2 className="mb-6 text-4xl font-bold">Welcome!</h2>
            <p className="text-xl font-bold">가입을 축하드립니다.</p>
            <p className="mt-4 text-gray-600">
              랩브릿지의 OEM/ODM 제조 상담, AI 패키지 기획, 제조사 매칭 서비스를 이용하실 수 있습니다.
            </p>

            <div className="mt-10 grid gap-3">
              <a
  href="/products"
  className="rounded-xl bg-black py-4 font-bold text-white"
>
  제형 보러가기
</a>
              <a href="/estimate" className="rounded-xl border py-4 font-bold">
                제조 문의하기
              </a>
              <a href="/" className="rounded-xl border py-4 font-bold">
                홈으로
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Agreement({
  title,
  required,
  checked,
  onChange,
  children,
}: {
  title: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4">
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 font-bold">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-5 w-5"
          />
          <span>
            {title} {required ? <span className="text-red-500">(필수)</span> : <span className="text-gray-400">(선택)</span>}
          </span>
        </label>

        <button type="button" onClick={() => setOpen(!open)} className="text-2xl">
          {open ? "⌃" : "⌄"}
        </button>
      </div>

      {open && (
        <div className="mt-4 h-52 space-y-4 overflow-y-auto bg-gray-50 p-5 text-sm leading-7 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

function Input({ placeholder, type = "text" }: { placeholder: string; type?: string }) {
  return <input type={type} placeholder={placeholder} className="w-full rounded-xl border px-4 py-4" />;
}