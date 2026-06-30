import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/mock/store";

export async function GET(req: NextRequest) {
  const filter = req.nextUrl.searchParams.get("filter") ?? "all";
  return NextResponse.json(listOrders(filter));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items = body.items.filter(
    (it: { productId: string; qty: number; rate: number }) => it.productId && it.qty > 0,
  );
  const order = createOrder({
    customerId: body.customerId,
    orderDate: body.orderDate,
    deliveryDate: body.deliveryDate || body.orderDate,
    items,
  });
  return NextResponse.json(order, { status: 201 });
}
