import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM inventory`;

    if (rows.rows.length > 0) {
      return NextResponse.json(
        {
          status: "success",
          message: "Successed getting api data",
          statusCode: 200,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "notFound",
          message: "Data not found",
          errorCode: 404,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "internalError",
        message: "Internal server error",
        errorCode: 500,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { type, id } = await req.json();
    // Gunakan prepared statement untuk mencegah SQL injection
    const { rows } = await sql`SELECT * FROM inventory WHERE uid = ${id} AND part_outfit = ${type}`; 

    if (rows.length > 0) {
      return NextResponse.json(rows, { status: 200 });
    } else {
      return NextResponse.json(
        {
          status: "notFound",
          message: "Data not found",
          errorCode: 404,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "internalError",
        message: "Internal server error",
        errorCode: 500,
      },
      { status: 500 }
    );
  }
}