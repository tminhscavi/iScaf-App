import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { TMember } from '@/types/member';

async function validateUser(member: TMember, password: string) {
  if (member.Pass === password) {
    return member;
  }
  return null;
}

export async function POST(request: Request) {
  const { member, password } = await request.json();

  // Validate credentials (implement your logic)
  const validatedMember = await validateUser(member, password);

  if (!validatedMember) {
    return Response.json({ error: 'Sai mật khẩu' }, { status: 200 });
  }

  // Create JWT token
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({
    member: validatedMember,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret);

  // Set cookie
  const cookie = serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return Response.json(
    { message: 'Login successful', token },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    },
  );
}
