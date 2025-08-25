/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFactories } from '@/services/factoryServices';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: any) {
  const data = await getFactories();

  return NextResponse.json(data);
}
