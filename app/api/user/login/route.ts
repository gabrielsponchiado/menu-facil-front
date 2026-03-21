import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(
      "https://john-overvigorous-cameron.ngrok-free.dev/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ detail: "Erro ao fazer login" }, { status: 500 });
  }
}