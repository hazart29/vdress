import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { rows } = await sql`SELECT * FROM players`;
    return NextResponse.json(rows, {status: 200});
}

export async function POST(req: Request, res: NextApiResponse) {
    const { user } = await new Response(req.body).json();
    const { rows } = await sql`SELECT * FROM players where username = ${user}`;
    return NextResponse.json(rows, {status: 200});
}