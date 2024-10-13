import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const userId = 7000002;
    try {
        const user = await sql`SELECT * FROM users WHERE uid = ${userId}`;
        const inventory = await sql`SELECT * FROM inventory WHERE uid = ${userId}`;
        const userResources = await sql`SELECT * FROM user_resources WHERE uid = ${userId}`;
        const suited = await sql`SELECT * FROM suited WHERE uid = ${userId}`;
        const items = await sql`SELECT * FROM gacha_item`;

        if (user.rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userData = {
            ...user.rows[0],
            inventory: inventory.rows,
            user_resources: userResources.rows,
            suited: suited.rows,
        };

        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
    }

    // ... kode untuk typeFetch lainnya ...
}