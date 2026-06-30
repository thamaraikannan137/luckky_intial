import { NextResponse } from "next/server";
import { getReports } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(getReports());
}
