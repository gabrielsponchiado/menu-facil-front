import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ item_name: string }> }
) {
  try {
    const { item_name } = await params;
    const authorization = request.headers.get("authorization") || "";

    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/combo/${encodeURIComponent(item_name)}`,
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
    console.error("Combo error:", error);
    return NextResponse.json({ detail: "Erro ao buscar combo" }, { status: 500 });
  }
}