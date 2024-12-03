// pages/api/outfit.js
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rows = await sql`SELECT * FROM suited`;

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
        const url = new URL(req.url);
        const uid = url.searchParams.get('uid');
        const action = url.searchParams.get('action');

        if (!uid || !action) {
            return NextResponse.json(
                {
                    status: "badRequest",
                    message: "Missing uid or action",
                    errorCode: 400
                },
                { status: 400 }
            );
        }

        switch (action) {
            case "updateOutfit":
                const top = url.searchParams.get('top');
                const bottom = url.searchParams.get('bottom');
                const feet = url.searchParams.get('feet');

                if (!top || !bottom || !feet) {
                    return NextResponse.json(
                        {
                            status: "badRequest",
                            message: "Missing required fields for updateOutfit",
                            errorCode: 400
                        },
                        { status: 400 }
                    );
                }

                const updateResult = await sql`
          UPDATE suited 
          SET a = ${top}, b = ${bottom}, c = ${feet} 
          WHERE uid = ${uid}
        `;

                if (updateResult.rowCount > 0) {
                    return NextResponse.json(
                        {
                            status: "success",
                            message: "Outfit updated successfully",
                            statusCode: 200
                        },
                        { status: 200 }
                    );
                } else {
                    return NextResponse.json(
                        {
                            status: "notFound",
                            message: "User not found",
                            errorCode: 404
                        },
                        { status: 404 }
                    );
                }
                break;

            case "addOutfit":
                // Add your logic here to add a new outfit to the database
                // Make sure to get the required parameters from url.searchParams
                break;

            case "getOutfitData":
                const { rows } = await sql`SELECT * FROM suited WHERE uid = ${uid}`;
                return new Response(JSON.stringify(rows), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });

            case "getOutfitByLayer":
                const layer = url.searchParams.get('layer');

                if (!layer) {
                    return NextResponse.json(
                        {
                            status: "badRequest",
                            message: "Missing layer for getOutfitByLayer",
                            errorCode: 400
                        },
                        { status: 400 }
                    );
                }

                const outfitLayer = await sql`SELECT * FROM inventory WHERE layer = ${layer} AND uid = ${uid} AND rarity !='R'`;
                return new Response(JSON.stringify(outfitLayer.rows), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });


            default:
                return NextResponse.json(
                    {
                        status: "badRequest",
                        message: "Invalid action",
                        errorCode: 400
                    },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                status: "internalError",
                message: "Internal server error",
                errorCode: 500
            },
            { status: 500 }
        );
    }
}