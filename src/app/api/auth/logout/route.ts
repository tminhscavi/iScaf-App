import { serialize } from 'cookie';

export async function POST(request: Request) {
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
  return Response.json(
    { message: 'Logged out successfully' },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    },
  );
}
