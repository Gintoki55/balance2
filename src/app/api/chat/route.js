// app/api/chat/route.js
export async function POST(req) {
  const { message } = await req.json();

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: message }),
      }
    );
    const data = await response.json();
    const text = data?.generated_text || data[0]?.generated_text || "No response";

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: 'Error: Unable to get response from AI.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}