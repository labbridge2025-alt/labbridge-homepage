import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NICE_API_URL = "https://auth.niceid.co.kr";

type NiceResultRequest = {
  webTransactionId?: string;
  requestNo?: string;
  transactionId?: string;
  accessToken?: string;
};

type NiceResultResponse = {
  result_code?: string;
  result_message?: string;
  request_no?: string;
  enc_data?: string;
  integrity_value?: string;
  data?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NiceResultRequest;

    const webTransactionId = body.webTransactionId;
    const requestNo = body.requestNo;
    const transactionId = body.transactionId;
    const accessToken = body.accessToken;

    if (
      !webTransactionId ||
      !requestNo ||
      !transactionId ||
      !accessToken
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "본인인증 결과 조회에 필요한 값이 없습니다.",
        },
        { status: 400 }
      );
    }

    const clientId = getRequiredEnv("NICE_CLIENT_ID");

    console.log("NICE 결과조회 요청값:", {
      clientId,
      requestNo,
      transactionId,
      webTransactionId,
      accessTokenLength: accessToken.length,
    });

    const response = await fetch(
      `${NICE_API_URL}/ido/intc/v1.0/auth/result`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Intc-DevLang": "Linux/Node.js",
        },
        body: JSON.stringify({
          client_id: clientId,
          request_no: requestNo,
          transaction_id: transactionId,
          web_transaction_id: webTransactionId,
        }),
        cache: "no-store",
      }
    );

    const data = (await response.json()) as NiceResultResponse;

    console.log("NICE 결과조회 응답:", data);

    if (!response.ok || data.result_code !== "0000") {
      return NextResponse.json(
        {
          success: false,
          code: data.result_code || "RESULT_ERROR",
          message:
            data.result_message ||
            "본인인증 결과 조회에 실패했습니다.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error("NICE 결과조회 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "본인인증 결과 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}