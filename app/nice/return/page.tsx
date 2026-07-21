"use client";

import { useEffect } from "react";

export default function NiceReturnPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const webTransactionId = params.get("web_transaction_id");

    if (!webTransactionId) {
      alert("본인인증 결과값을 찾지 못했습니다.");
      return;
    }

    localStorage.setItem(
      "niceAuthCallback",
      JSON.stringify({
        webTransactionId,
        createdAt: Date.now(),
      })
    );

    window.opener?.postMessage(
      {
        type: "NICE_AUTH_COMPLETE",
        webTransactionId,
      },
      window.location.origin
    );

    setTimeout(() => {
      window.close();
    }, 300);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p>본인인증 결과를 확인하고 있습니다.</p>
    </main>
  );
}