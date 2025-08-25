import { api } from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } },
) {
  const { path } = context.params;

  const data = await api.get(`/Eoffice/${path.join('/')}`);

  return NextResponse.json(data);
}
