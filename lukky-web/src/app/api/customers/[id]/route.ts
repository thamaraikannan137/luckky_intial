import { NextRequest, NextResponse } from "next/server";
import { deleteCustomer, getCustomer, updateCustomer } from "@/lib/mock/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = getCustomer(id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const customer = updateCustomer(id, body);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!deleteCustomer(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
