import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ detail: "user_id é obrigatório" }, { status: 400 });
    }

    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/order/${userId}`,
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
    console.error("Order history proxy error:", error);
    return NextResponse.json({ detail: "Erro ao buscar pedidos" }, { status: 500 });
  }
}