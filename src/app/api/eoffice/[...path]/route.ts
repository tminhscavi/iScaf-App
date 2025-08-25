import { api } from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const data = await api.get(
    `/Eoffice/${params.path.join('/')}`,
  );
console.log('data',data);

  return NextResponse.json(data);
}
