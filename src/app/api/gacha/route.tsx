import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    return NextResponse.json({ message: 'api running successfully' }, { status: 200 });
}

export async function POST(req: Request) {
    const { userId, typeFetch, dataFetch } = await new Response(req.body).json();
    if (typeFetch === 'updatePrimo') {
        const { rows } = await sql`SELECT primogems FROM users WHERE uid = ${userId}`;
        const currentPrimo = rows[0].primogems;

        // Calculate the new value of primo after subtracting primogems
        const newPrimo = currentPrimo - dataFetch.primogems;

        // Update the value of primo in the database
        await sql`UPDATE users SET primogems = ${newPrimo} WHERE uid = ${userId}`;

        // Return a response indicating success
        return NextResponse.json({ message: 'primogems updated successfully' }, { status: 200 });
    } else if (typeFetch === 'resetPity') {
        const { rows } = await sql`SELECT * FROM users WHERE uid = ${userId}`;
        if (rows.length > 0) { // Check if any rows were returned
            await sql`UPDATE users SET pitycounter = 0 WHERE uid = ${userId}`;

            // Return a response indicating success
            return NextResponse.json({ message: 'pity updated to 0 successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'user not found' }, { status: 404 });
        }

    } else if (typeFetch === 'incPity') {
        const { rows } = await sql`SELECT pitycounter FROM users WHERE uid = ${userId}`;
        if (rows.length > 0) {
            // Calculate the new value of primo after subtracting primogems
            const newPity = dataFetch.incPity;

            // Update the value of primo in the database
            await sql`UPDATE users SET pitycounter = ${newPity} WHERE uid = ${userId}`;

            // Return a response indicating success
            return NextResponse.json({ message: 'pity updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'pity not updated' }, { status: 200 });
        }
    } else if (typeFetch === 'upInven') {
        let item_name = dataFetch.item_name;
        let rarity = dataFetch.rarity;
        let part_outfit = dataFetch.part_outfit;
        const { rows } = await sql`SELECT id FROM users WHERE uid = ${userId}`;

        await sql`INSERT INTO Inventory (uid, rarity, item_name, part_outfit)
        VALUES (${rows[0].uid}, ${rarity}, ${item_name}, ${part_outfit});`;
        return NextResponse.json({ message: `${item_name}, push successfully` }, { status: 200 });
    } else if (typeFetch === 'getPity') {
        const { rows } = await sql`SELECT * FROM users WHERE uid = ${userId}`;
        return NextResponse.json(rows, { status: 200 });
    } else if (typeFetch === 'getLimitedItem') {
        let rarity: string = dataFetch.rarity;
        const { rows } = await sql`SELECT * FROM gacha_item WHERE rarity = ${rarity} AND type = 'limited'`;
        return NextResponse.json(rows, { status: 200 });
    } else if (typeFetch === 'getRateOn') {
        const { rows } = await sql`SELECT rate_on FROM users WHERE uid = ${userId}`;
        return NextResponse.json(rows[0].rate_on, { status: 200 });
    } else if (typeFetch === 'getGachaItem') {
        let rarity: string = dataFetch.rarity;
        const { rows } = await sql`SELECT * FROM gacha_item WHERE rarity = ${rarity}`;
        return NextResponse.json(rows, { status: 200 });
    } else if (typeFetch === 'setRateOn') {
        const { rows } = await sql`UPDATE users SET rate_on = true WHERE uid = ${userId}`;
        return NextResponse.json(rows, { status: 200 });
    } else if (typeFetch === 'setRateOff') {
        const { rows } = await sql`UPDATE users SET rate_on = false WHERE uid = ${userId}`;
        return NextResponse.json(rows, { status: 200 });
    }
}