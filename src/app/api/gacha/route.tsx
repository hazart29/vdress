import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    const { rows } = await sql`SELECT * FROM players`;
    return NextResponse.json(rows[1].primogems, { status: 200 });
}

export async function POST(req: Request, res: NextApiResponse) {
    const { user, typeFetch, dataFetch } = await new Response(req.body).json();
    if (typeFetch === 'updatePrimo') {
        const { rows } = await sql`SELECT primogems FROM players WHERE username = ${user}`;
        const currentPrimo = rows[0].primogems;

        // Calculate the new value of primo after subtracting primogems
        const newPrimo = currentPrimo - dataFetch.primogems;

        // Update the value of primo in the database
        await sql`UPDATE players SET primogems = ${newPrimo} WHERE username = ${user}`;

        // Return a response indicating success
        return NextResponse.json({ message: 'primogems updated successfully' }, { status: 200 });
    } else if (typeFetch === 'resetPity') {

        // Calculate the new value of primo after subtracting primogems
        const newPity = dataFetch.pityCounter;

        // Update the value of primo in the database
        await sql`UPDATE players SET pitycounter = ${newPity} WHERE username = ${user}`;

        // Return a response indicating success
        return NextResponse.json({ message: 'pity updated to 0 successfully' }, { status: 200 });
    } else if (typeFetch === 'incPity') {
        const { rows } = await sql`SELECT pitycounter FROM players WHERE username = ${user}`;
        const currentPity = rows[0].pitycounter;

        // Calculate the new value of primo after subtracting primogems
        const newPity = currentPity + dataFetch.incPity;

        // Update the value of primo in the database
        await sql`UPDATE players SET pitycounter = ${newPity} WHERE username = ${user}`;

        // Return a response indicating success
        return NextResponse.json({ message: 'pity updated +1 successfully' }, { status: 200 });
    } else if (typeFetch === 'upInven') {
        let item = dataFetch.item;
        let rare = dataFetch.rarity;
        const { rows } = await sql`SELECT id FROM players WHERE username = 'user1'`;

        await sql`INSERT INTO Inventory (player_id, rarity, item_name)
        VALUES (${rows[0].id}, ${rare}, ${item});`;
        return NextResponse.json({ message: '${rarityColumn} push successfully' }, { status: 200 });
    }
}