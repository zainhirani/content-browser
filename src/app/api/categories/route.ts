import { NextResponse } from "next/server";
import { listCategories } from "@/modules/catalog";

export const GET = () => {
  return NextResponse.json({ items: listCategories() });
}
