import { NextResponse } from "next/server";
import { getDashboard } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(getDashboard());
}
