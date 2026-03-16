import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://john-overvigorous-cameron.ngrok-free.dev/menu/",
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
    console.error("Menu proxy error:", error);

    return NextResponse.json(
      { detail: "Erro ao buscar menu" },
      { status: 500 }
    );
  }
}
