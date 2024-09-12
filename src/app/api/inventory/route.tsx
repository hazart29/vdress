import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next/types";

export async function GET() {
    // Mengambil data pemain
    const { rows: inventory } = await sql`SELECT * FROM inventory`;

    // Mengirim respons dengan data pemain yang telah diperbarui
    return NextResponse.json(inventory, { status: 200 });
}

export async function POST(req: Request, res: NextApiResponse) {
    const { type, id } = await new Response(req.body).json();
    const { rows: outfitTop } = await sql`SELECT * FROM inventory WHERE player_id = ${id} AND part_outfit = ${type}`;

    // Mengirim respons dengan data pemain yang telah diperbarui
    return NextResponse.json(outfitTop, { status: 200 });
}