import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
    // Mengambil data pemain
    const { rows: players } = await sql`SELECT * FROM players`;

    // Mengambil data inventaris untuk setiap pemain
    for (let i = 0; i < players.length; i++) {
        const playerId = players[i].id;
        const { rows: inventory } = await sql`SELECT * FROM inventory WHERE player_id = ${playerId}`;
        players[i].inventory = inventory;
    }

    // Mengirim respons dengan data pemain yang telah diperbarui
    return NextResponse.json(players, { status: 200 });
}