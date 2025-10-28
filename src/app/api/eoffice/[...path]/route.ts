/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: any) {
  const params = await context.params;
  const path = params.path as string[];

  const data = await api.get(`/Eoffice/${path.join('/')}`);

  if (data) {
    return NextResponse.json(data);
  }

  return NextResponse.error();
}
