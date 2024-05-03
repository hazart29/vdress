import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(res: NextApiResponse) {
    const { rows } = await sql`UPDATE players SET primogems = 99999`;
    return NextResponse.json({message: 'sukses tambah primo semua player 99999'}, {status: 200});
}