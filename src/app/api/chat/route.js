import { m } from "framer-motion";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "stepfun/step-3.5-flash:free",
          messages: [
           {
            role: "system",
            content: `
            أنت مساعد تعليمي متخصص في تحلية المياه.
            أجب باللغة العربية الفصحى فقط.
            اكتب إجابات واضحة ومنظمة ومناسبة للطلاب.
            لا تستخدم أي لغة أخرى.
            `
            },
            {
              role: "user",
              content: message
            }
          ]
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content  || "لم يصل رد من النموذج";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    return NextResponse.json({ reply: "حدث خطأ في النظام" });
  }
}