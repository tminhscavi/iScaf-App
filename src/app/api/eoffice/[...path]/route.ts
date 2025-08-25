/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: any) {
  const path = context.params.path as string[];

  const data = await api.get(`/Eoffice/${path.join('/')}`);

  return NextResponse.json(data);
}
