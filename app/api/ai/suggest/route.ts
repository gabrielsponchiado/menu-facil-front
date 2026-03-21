import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userText = searchParams.get("user_text");
    const authorization = request.headers.get("authorization") || "";

    if (!userText) {
      return NextResponse.json({ detail: "user_text é obrigatório" }, { status: 400 });
    }

    const url = new URL("https://john-overvigorous-cameron.ngrok-free.dev/ai/suggest");
    url.searchParams.append("user_text", userText);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "authorization": authorization,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("AI suggest error:", error);
    return NextResponse.json({ detail: "Erro ao buscar sugestão" }, { status: 500 });
  }
}