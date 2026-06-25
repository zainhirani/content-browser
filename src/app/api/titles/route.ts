import { NextResponse } from "next/server";
import {
  listTitles,
  parseCategory,
  parsePositiveInt,
} from "@/modules/catalog";

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() || undefined;
  const category = parseCategory(searchParams.get("category"));
  const page = parsePositiveInt(searchParams.get("page"));
  const pageSize = parsePositiveInt(searchParams.get("pageSize"));

  const result = listTitles({ search, category, page, pageSize });
  return NextResponse.json(result);
}