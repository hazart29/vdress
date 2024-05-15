import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request, res: NextApiResponse) {
  const { rows } = await sql`SELECT * FROM players where email = 'email1@email.com'`;
  return NextResponse.json(rows, { status: 200 });
}
//
export async function POST(req: Request, res: NextApiResponse) {
  const { email, password } = await new Response(req.body).json();
  const { rows } = await sql`SELECT * FROM players where email = ${email}`;
  const user = rows;
  const isMatch = await bcrypt.compare(password, user[0].password);

  if (rows.length === 0) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  } else if (!isMatch) {
    return NextResponse.json({ message: 'Password not match'}, { status: 401 });
  } else {
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({ token, user: user[0] }, { status: 200 });
  }
}