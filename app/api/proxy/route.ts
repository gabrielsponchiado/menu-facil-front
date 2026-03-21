import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://john-overvigorous-cameron.ngrok-free.dev/${path.startsWith("/") ? path.slice(1) : path}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!res.ok) {
      return new Response("Not found", { status: res.status });
    }

    const blob = await res.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Error proxying image", { status: 500 });
  }
}
