import { serialize } from 'cookie';

export async function POST(request: Request) {
  const { token } = await request.json();

  // Set cookie
  const cookie = serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });


  return Response.json(
    { message: 'Auth successfully'},
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    },
  );
}
