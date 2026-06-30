import { NextRequest, NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/mock/store";

export async function GET() {
  return NextResponse.json(listProducts());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
