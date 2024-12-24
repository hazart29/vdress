import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import sjcl from 'sjcl';

const pwd = process.env.SJCL_PASSWORD;

export async function GET() {
    try {
        const rows = await sql`SELECT * FROM users`;

        if (rows.rows) {
            return NextResponse.json({ status: "success", message: 'Successed getting api data', statusCode: 200 }, { status: 200 });
        } else {
            return NextResponse.json({ status: "notFound", message: 'Data not found', errorCode: 404 }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "internalError", message: 'Internal server error', errorCode: 500 }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { encryptedData } = await req.json();
    const decryptedData = JSON.parse(sjcl.decrypt(pwd as string, encryptedData));
    const { username, password, email, name } = decryptedData;

    try {
        if (!username || !password || !email || !name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
        if (existingUser.rowCount > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows: users } = await sql`
            INSERT INTO users (username, password, email, name)
            VALUES (${username}, ${hashedPassword}, ${email}, ${name})
            RETURNING *
        `;

        const newUser = users[0];

        if (newUser) {
            const encryptedReturnData = sjcl.encrypt(pwd as string, JSON.stringify(newUser));
            return NextResponse.json({ encryptedReturnData: encryptedReturnData }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}