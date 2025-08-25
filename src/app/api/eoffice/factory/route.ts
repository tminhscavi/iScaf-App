import { getFactories } from "@/services/factoryServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const data = await getFactories()

  return NextResponse.json(data);
}