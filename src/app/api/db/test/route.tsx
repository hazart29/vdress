import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    let item = "SSR";
    let rare = "SSR";
    const { rows } = await sql`SELECT id FROM players WHERE username = 'user1'`;

    await sql`INSERT INTO Inventory (player_id, rarity, item_name)
        VALUES (${rows[0].id}, ${rare}, ${item});`;
    return NextResponse.json({ message: '${rarityColumn} push successfully' }, { status: 200 });
}