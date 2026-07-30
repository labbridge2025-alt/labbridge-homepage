"use client";

import { useEffect, useState } from "react";

export default function NiceReturnPage() {
  const [message, setMessage] = useState(
    "본인인증 결과를 확인하고 있습니다."
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    console.log("NICE 콜백 전체 주소:", window.location.href);
    console.log(
      "NICE 콜백 파라미터:",
      Object.fromEntries(params.entries())
    );

    const webTransactionId =
      params.get("web_transaction_id") ||
      params.get("webTransactionId") ||
      params.get("web_transactionId");

    console.log("전달받은 webTransactionId:", webTransactionId);

    if (!webTransactionId) {
      setMessage(
        `결과값을 찾지 못했습니다.\n현재 주소: ${window.location.href}`
      );

      alert("본인인증 결과값을 찾지 못했습니다.");
      return;
    }

    const callbackData = {
      webTransactionId,
      createdAt: Date.now(),
    };

    localStorage.setItem(
      "niceAuthCallback",
      JSON.stringify(callbackData)
    );

    console.log("NICE 결과 저장 완료:", callbackData);

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        {
          type: "NICE_AUTH_COMPLETE",
          webTransactionId,
        },
        "https://labbridge.co.kr"
      );

      console.log("부모창으로 인증 완료 메시지 전송");
    } else {
      console.log("window.opener가 없거나 닫혀 있습니다.");
    }

    setMessage("본인인증이 완료되었습니다.");

    setTimeout(() => {
      window.close();
    }, 1500);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="whitespace-pre-wrap text-center">{message}</p>
    </main>
  );
}