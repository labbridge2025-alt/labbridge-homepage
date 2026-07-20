import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NICE_API_URL = "https://auth.niceid.co.kr";

type NiceTokenResponse = {
  result_code?: string;
  result_message?: string;
  request_no?: string;
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  iterators?: number;
  ticket?: string;
};

type NiceAuthUrlResponse = {
  result_code?: string;
  result_message?: string;
  request_no?: string;
  auth_url?: string;
  transaction_id?: string;
};

function createRequestNo() {
  return `LB${Date.now()}${randomBytes(8).toString("hex")}`;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }

  return value;
}

export async function POST() {
  try {
    const clientId = getRequiredEnv("NICE_CLIENT_ID");
    const clientSecret = getRequiredEnv("NICE_SECRET_KEY");
    const returnUrl = getRequiredEnv("NICE_RETURN_URL");

    /*
     * 1. NICE 접근 토큰 발급
     */
    const basicAuth = Buffer.from(
      `${clientId}:${clientSecret}`,
      "utf8"
    ).toString("base64url");

    const tokenRequestNo = createRequestNo();

    const tokenResponse = await fetch(
      `${NICE_API_URL}/ido/intc/v1.0/auth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
          "X-Intc-DevLang": "Linux/Node.js",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          request_no: tokenRequestNo,
        }),
        cache: "no-store",
      }
    );

    const tokenData =
      (await tokenResponse.json()) as NiceTokenResponse;

    if (
      !tokenResponse.ok ||
      tokenData.result_code !== "0000" ||
      !tokenData.access_token ||
      !tokenData.ticket ||
      typeof tokenData.iterators !== "number"
    ) {
      console.error("NICE 토큰 발급 실패:", tokenData);

      return NextResponse.json(
        {
          success: false,
          code: tokenData.result_code || "TOKEN_ERROR",
          message:
            tokenData.result_message ||
            "NICE 접근 토큰 발급에 실패했습니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 2. 휴대폰 본인인증 URL 발급
     */
    const authRequestNo = createRequestNo();

    const authResponse = await fetch(
      `${NICE_API_URL}/ido/intc/v1.0/auth/url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
          "X-Intc-DevLang": "Linux/Node.js",
        },
        body: JSON.stringify({
          request_no: authRequestNo,
          return_url: returnUrl,
          svc_types: ["M"],
          method_type: "GET",
          exp_mods: ["closeButtonOn"],
        }),
        cache: "no-store",
      }
    );

    const authData =
      (await authResponse.json()) as NiceAuthUrlResponse;

    if (
      !authResponse.ok ||
      authData.result_code !== "0000" ||
      !authData.auth_url ||
      !authData.transaction_id
    ) {
      console.error("NICE 인증 URL 발급 실패:", authData);

      return NextResponse.json(
        {
          success: false,
          code: authData.result_code || "AUTH_URL_ERROR",
          message:
            authData.result_message ||
            "NICE 인증 URL 발급에 실패했습니다.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * 다음 단계의 인증 결과 조회에 필요한 값도 함께 반환
     * 현재 테스트 단계라 브라우저 sessionStorage에 임시 저장 예정
     */
    return NextResponse.json({
      success: true,
      authUrl: authData.auth_url,
      requestNo: authData.request_no || authRequestNo,
      transactionId: authData.transaction_id,
      accessToken: tokenData.access_token,
      ticket: tokenData.ticket,
      iterators: tokenData.iterators,
    });
  } catch (error) {
    console.error("NICE 인증 요청 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "NICE 인증 요청 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      }
    );
  }
}