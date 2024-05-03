import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(res: NextApiResponse) {
    const { rows } = await sql`SELECT * FROM players`;
    return NextResponse.json(rows[1].primogems, { status: 200 });
}

export async function POST(req: Request, res: NextApiResponse) {
    const { user, primogems } = await new Response(req.body).json();
    const { rows } = await sql`SELECT primogems FROM players WHERE username = ${user}`;
    const currentPrimo = rows[0].primogems;

    // Calculate the new value of primo after subtracting primogems
    const newPrimo = currentPrimo - primogems;

    // Update the value of primo in the database
    await sql`UPDATE players SET primogems = ${newPrimo} WHERE username = ${user}`;

    // Return a response indicating success
    return NextResponse.json({ message: 'primogems updated successfully'}, {status:200});
}