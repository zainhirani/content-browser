import { NextResponse } from "next/server";
import { listCategories } from "@/modules/catalog";

export function GET() {
  return NextResponse.json({ items: listCategories() });
}
