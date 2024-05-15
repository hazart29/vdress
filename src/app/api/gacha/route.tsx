import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { rows } = await sql`SELECT * FROM players`;
    return NextResponse.json(rows, { status: 200 });
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
        const { rows } = await sql`SELECT * FROM players WHERE username = ${user}`;
        if (rows.length > 0) { // Check if any rows were returned
            await sql`UPDATE players SET pitycounter = 0 WHERE username = ${user}`;

            // Return a response indicating success
            return NextResponse.json({ message: 'pity updated to 0 successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'user not found' }, { status: 404 });
        }

    } else if (typeFetch === 'incPity') {
        const { rows } = await sql`SELECT pitycounter FROM players WHERE username = ${user}`;
        if (rows.length > 0) {
            // Calculate the new value of primo after subtracting primogems
            const newPity = dataFetch.incPity;

            // Update the value of primo in the database
            await sql`UPDATE players SET pitycounter = ${newPity} WHERE username = ${user}`;

            // Return a response indicating success
            return NextResponse.json({ message: 'pity updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'pity not updated' }, { status: 200 });
        }
    } else if (typeFetch === 'upInven') {
        let item = dataFetch.item;
        let rare = dataFetch.rarity;
        const { rows } = await sql`SELECT id FROM players WHERE username = ${user}`;

        await sql`INSERT INTO Inventory (player_id, rarity, item_name)
        VALUES (${rows[0].id}, ${rare}, ${item});`;
        return NextResponse.json({ message: '${rarityColumn} push successfully' }, { status: 200 });
    } else if (typeFetch === 'getPity') {
        const { rows } = await sql`SELECT * FROM players WHERE username = ${user}`;
        return NextResponse.json(rows, { status: 200 });
    }
}