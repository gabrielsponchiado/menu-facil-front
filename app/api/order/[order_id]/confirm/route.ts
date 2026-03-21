import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id } = await params;
    const body = await request.text();
    const authorization = request.headers.get("authorization") || "";
    
    const fetchHeaders: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      "authorization": authorization,
    };

    if (body) {
      fetchHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/order/${order_id}/confirm`,
      {
        method: "PATCH",
        headers: fetchHeaders,
        body: body || undefined,
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("Backend error detail:", JSON.stringify(data, null, 2));
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Order confirm error:", error);
    return NextResponse.json({ detail: "Erro ao confirmar pagamento" }, { status: 500 });
  }
}