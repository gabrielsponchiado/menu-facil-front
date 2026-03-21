import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";

    const res = await fetch(
      "https://john-overvigorous-cameron.ngrok-free.dev/order/me",
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "authorization": authorization,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Order history error:", error);
    return NextResponse.json({ detail: "Erro ao buscar pedidos" }, { status: 500 });
  }
}