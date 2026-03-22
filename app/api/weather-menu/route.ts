import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization") || "";

    const res = await fetch(
      "https://john-overvigorous-cameron.ngrok-free.dev/weather-menu",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "authorization": authorization,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Weather menu error:", error);
    return NextResponse.json(
      { detail: "Erro ao buscar menu climático" },
      { status: 500 }
    );
  }
}