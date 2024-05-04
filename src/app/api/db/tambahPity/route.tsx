import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    await sql`UPDATE players SET pitycounter = 90`;
    return NextResponse.json({message: 'sukses tambah pity semua player 90'}, {status: 200});
}