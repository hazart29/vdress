import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next/types";

export async function GET() {
    try {
        const rows = await sql`SELECT * FROM inventory`;

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

export async function POST(req: Request, res: NextApiResponse) {
    const { type, id } = await new Response(req.body).json();
    const { rows } = await sql`SELECT * FROM inventory WHERE uid = ${id} AND part_outfit = ${type}`;
    if (rows ){
        return NextResponse.json(rows, { status: 200 });
    } else {
        return NextResponse.json(null, { status: 200})
    }
}