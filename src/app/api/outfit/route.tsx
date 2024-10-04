import { sql } from "@vercel/postgres";

export async function GET() {
    return new Response(JSON.stringify('API Running Successfully!'), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST() {
    const { rows } = await sql`SELECT * FROM suited`;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
}