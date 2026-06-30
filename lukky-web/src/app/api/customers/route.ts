import { NextRequest, NextResponse } from "next/server";
import { createCustomer, listCustomers } from "@/lib/mock/store";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? undefined;
  return NextResponse.json(listCustomers(q, type));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const customer = createCustomer(body);
  return NextResponse.json(customer, { status: 201 });
}
