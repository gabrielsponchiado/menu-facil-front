import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { detail: "email é obrigatório" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/user/login/${email}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { detail: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}