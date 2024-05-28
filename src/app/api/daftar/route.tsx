// pages/api/daftar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'berhasil get api daftar' }, { status: 200 });
}

export async function POST(req: NextApiRequest) {
    const { username, password, email, name, primogems, pitycounter } = await new Response(req.body).json();

    try {
        // Validate input
        if (!username || !password || !email || !name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await sql`SELECT * FROM players WHERE email = ${email} OR username = ${username}`;
        if (existingUser.rowCount > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user to database
        // Save new user to database using parameterized query
        const { rows } = await sql`
        INSERT INTO players (username, password, email, name, primogems, pitycounter)
        VALUES (${username}, ${hashedPassword}, ${email}, ${name}, 0, 0)
        RETURNING *
        `;

        const newUser = rows[0];
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
