import { neon } from '@neondatabase/serverless';
import { Params } from 'next/dist/server/request/params';
import { NextRequest, NextResponse } from 'next/server';

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    const rows: any  = await sql`SELECT * FROM user_resources WHERE uid = ${uid}`;

    if (rows) {
      return NextResponse.json({
        status: "success",
        message: "user resources retrieved successfully",
        data: rows[0],
        statusCode: 200,
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User resource not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user resource:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}