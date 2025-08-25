import { api } from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { [key: string]: string | string[] } },
) {
  const path = params.path as string[];

  const data = await api.get(`/Eoffice/${path.join('/')}`);

  return NextResponse.json(data);
}
