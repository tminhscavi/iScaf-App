import { SignJWT } from 'jose';
import { serialize } from 'cookie';

async function validateUser(email: string, password: string) {
  // Your user validation logic here
  // Return user object if valid, null if invalid
  return {
    email,
  };
}

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validate credentials (implement your logic)
  const user = await validateUser(email, password);

  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create JWT token
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({
    email: user.email,
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
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return Response.json(
    { message: 'Login successful', user: { email: user.email } },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    },
  );
}
