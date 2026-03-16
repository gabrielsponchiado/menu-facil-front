import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const res = await fetch(
      "https://john-overvigorous-cameron.ngrok-free.dev/order/",
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
    console.error("Order proxy error:", error);
    return NextResponse.json(
      { detail: "Erro ao processar pedido no servidor" },
      { status: 500 }
    );
  }
}
