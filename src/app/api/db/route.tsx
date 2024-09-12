import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const userId = 7000002
        const { rows } = await sql`SELECT * FROM users where uid = ${userId}`;
        const user = rows[0];
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const { userId } = await new Response(req.body).json();
        const { rows } = await sql`SELECT * FROM users where uid = ${userId}`;
        const user = rows;
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
    }
}