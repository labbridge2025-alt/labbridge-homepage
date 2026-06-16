import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { product, concept } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `
Realistic cosmetic packaging mockup.
Product: ${product}
Concept: ${concept}
Premium Korean skincare brand.
White background.
Studio lighting.
Modern luxury package.
      `,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json({
        success: false,
        error: "이미지 데이터 없음",
      });
    }

    return Response.json({
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
  success: false,
  error: error instanceof Error ? error.message : "이미지 생성 실패",
});
  }
}