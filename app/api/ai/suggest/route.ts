import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userText = searchParams.get("user_text");
    const userId = searchParams.get("user_id");
    const context = searchParams.get("context") || "";

    if (!userText || !userId) {
      return NextResponse.json(
        { detail: "user_text e user_id são obrigatórios" },
        { status: 400 }
      );
    }

    const url = new URL("https://john-overvigorous-cameron.ngrok-free.dev/ai/suggest");
    url.searchParams.append("user_text", userText);
    url.searchParams.append("user_id", userId);
    url.searchParams.append("context", context);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("AI suggest proxy error:", error);
    return NextResponse.json(
      { detail: "Erro ao buscar sugestão da IA" },
      { status: 500 }
    );
  }
}