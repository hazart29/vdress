import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM users`;

    if (rows) {
      return NextResponse.json({ status: "success", message: 'Successed getting api data', statusCode: 200 }, { status: 200 });
    } else {
      return NextResponse.json({ status: "notFound", message: 'Data not found', errorCode: 404 }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "internalError", message: 'Internal server error', errorCode: 500 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // Use req.json() directly

    const [user] = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`; // Use LIMIT 1 for efficiency and destructuring

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Password not match' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.uid }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return NextResponse.json({ token, user }, { status: 200 });

  } catch (error) {
    console.error("Authentication error:", error); // Log the error for debugging
    return NextResponse.json({ message: 'An error occurred during authentication' }, { status: 500 }); // Generic error message for security
  }
}