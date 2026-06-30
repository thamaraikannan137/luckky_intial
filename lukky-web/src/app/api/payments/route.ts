import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/mock/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const payment = createPayment(body);
  return NextResponse.json(payment, { status: 201 });
}
