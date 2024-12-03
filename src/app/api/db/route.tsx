import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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
    try {
        const { uid } = await new Response(req.body).json();
        const { rows } = await sql`SELECT * FROM users where uid = ${uid}`;
        const user = rows;
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
    }
}