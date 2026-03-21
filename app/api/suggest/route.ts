import { NextResponse } from "next/server";

// GET /api/suggest — sugestão automática baseada no perfil do usuário
export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const res = await fetch("https://john-overvigorous-cameron.ngrok-free.dev/suggest", {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "authorization": authorization,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Suggest error:", error);
    return NextResponse.json({ detail: "Erro ao buscar sugestões" }, { status: 500 });
  }
}