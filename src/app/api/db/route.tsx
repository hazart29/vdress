import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    // Mengambil data pemain
    const { rows: users } = await sql`SELECT * FROM users`;

    // Mengambil data inventaris untuk setiap pemain
    for (let i = 0; i < users.length; i++) {
        const playerId = users[i].id;
        const { rows: inventory } = await sql`SELECT * FROM inventory WHERE uid = ${playerId}`;
        users[i].inventory = inventory;
    }

    // Mengirim respons dengan data pemain yang telah diperbarui
    return NextResponse.json(users, {status: 200 });
}


export async function POST(req: Request) {
    const { userId } = await new Response(req.body).json();
    const { rows } = await sql`SELECT * FROM users where uid = ${userId}`;
    return NextResponse.json(rows, {status: 200});
}