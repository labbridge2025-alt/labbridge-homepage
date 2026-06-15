"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Header from "@/components/Header";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인되었습니다.");
      window.location.href = "/";
    } catch (error: any) {
      alert("로그인 실패\n" + error.message);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("비밀번호를 재설정할 이메일을 입력해주세요.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("비밀번호 재설정 메일을 발송했습니다.");
    } catch (error: any) {
      alert("메일 발송 실패\n" + error.message);
    }
  };
const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

    alert("구글 로그인 완료");
    window.location.href = "/";
  } catch (error: any) {
    alert(error.message);
  }
};
  return (
    <>
      <Header />

      <main className="pt-32 pb-24">
        <section className="max-w-xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-10">로그인</h1>

          <div className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full border rounded-xl px-4 py-4"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border rounded-xl px-4 py-4"
            />

            <button
              type="button"
              onClick={login}
              className="w-full bg-black text-white py-4 rounded-xl font-bold"
            >
              로그인
            </button>
<button
  type="button"
  onClick={googleLogin}
  className="w-full border py-4 rounded-xl font-bold flex items-center justify-center gap-3"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="google"
    className="w-5 h-5"
  />
  Google로 로그인
</button>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <button
                type="button"
                onClick={resetPassword}
                className="underline"
              >
                비밀번호 찾기
              </button>

              <a href="/signup" className="underline">
                회원가입
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}