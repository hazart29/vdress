import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    await sql`UPDATE users SET primogems = 99999`;
    return NextResponse.json({message: 'sukses tambah primo semua player 99999'}, {status: 200});
}