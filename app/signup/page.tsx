"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/Header";

export default function SignupPage() {
  const [company, setCompany] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!company || !manager || !phone || !email || !password) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        company,
        manager,
        phone,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("회원가입이 완료되었습니다.");
      window.location.href = "/login";
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />

      <main className="pt-32 pb-24">
        <section className="max-w-xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-10">회원가입</h1>

          <div className="space-y-5">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="회사명 또는 브랜드명"
              className="w-full border rounded-xl px-4 py-4"
            />

            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="담당자명"
              className="w-full border rounded-xl px-4 py-4"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처"
              className="w-full border rounded-xl px-4 py-4"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              type="email"
              className="w-full border rounded-xl px-4 py-4"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 6자리 이상"
              type="password"
              className="w-full border rounded-xl px-4 py-4"
            />

            <button
              type="button"
              onClick={signup}
              className="w-full bg-black text-white py-4 rounded-xl font-bold"
            >
              회원가입
            </button>

            <a
              href="/login"
              className="block text-center text-gray-500 underline"
            >
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </section>
      </main>
    </>
  );
}