import { NextResponse } from "next/server";

// Proxy para buscar o QR code do ngrok sem bloqueio de CORS
export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/qrcodes/${filename}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!res.ok) throw new Error("QR code não encontrado");

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("QR code proxy error:", error);
    return NextResponse.json({ detail: "Erro ao buscar QR code" }, { status: 500 });
  }
}