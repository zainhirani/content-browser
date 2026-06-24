import { NextResponse } from "next/server";
import { getTitleById } from "@/modules/catalog";

export function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const title = getTitleById(params.id);

  if (!title) {
    return NextResponse.json({ error: "Title not found" }, { status: 404 });
  }

  return NextResponse.json(title);
}