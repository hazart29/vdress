import { sql } from "@vercel/postgres";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
    const { rows } = await sql`SELECT * FROM suited`;
    return NextResponse.json(rows, { status: 200 });
}