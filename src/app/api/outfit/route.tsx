import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { rows: outfit } = await sql`SELECT * FROM clothes`;
    return NextResponse.json(outfit, { status: 200 });
}