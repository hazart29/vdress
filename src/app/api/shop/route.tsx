// /api/shop.ts
import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { GachaItem, User_resources } from "@/app/interface";
import sjcl from "sjcl";
import { NextResponse } from "next/server";

const password = process.env.SJCL_PASSWORD; // Retrieve password from environment variables

export async function GET() {
    try {
        // Fetch all gacha items (or implement filtering/pagination as needed)
        const { rows } = await sql`SELECT * FROM products`;
        return NextResponse.json({ rows }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'internal server error' }, { status: 500 });

    }
}

export async function POST(req: Request) {
    try {
        const { encryptedData } = await req.json(); // Terima data terenkripsi
        console.log("Data terenkripsi yang diterima:", encryptedData);
        const decryptedData = JSON.parse(sjcl.decrypt(password as string, encryptedData));

        const { uid, typeFetch, ...dataFetch } = decryptedData;

        switch (typeFetch) {
            case "getGlamourGems": {
                const userResourcesResult = await sql<User_resources>`SELECT glamour_gems FROM user_resources WHERE uid = ${uid}`;
                const glamourGems = userResourcesResult.rows[0]?.glamour_gems || 0;
                return NextResponse.json({ glamourGems }, { status: 200 });
            }
            case "topUp": {
                const { packageId } = dataFetch;
                console.log('id: ', packageId);

                // 1. Retrieve package details
                const { rows: [packageInfo] } = await sql`SELECT glamour_gems FROM products WHERE id = ${packageId}`;

                if (!packageInfo) {
                    return NextResponse.json({ message: 'Package not found' }, { status: 404 });
                }

                const { rows: [userGems] } = await sql`SELECT glamour_gems FROM user_resources WHERE uid = ${uid}`;

                if (!userGems) {
                    return NextResponse.json({ error: 'user_resources not found' }, { status: 404 });
                }

                const oldGems = userGems.glamour_gems; // Extract the glamour_gems value

                // 3. Update the user's glamour_gems balance
                const newGems = oldGems + packageInfo.glamour_gems; // Add the package's gems to the user's gems

                await sql`UPDATE user_resources SET glamour_gems = ${newGems} WHERE uid = ${uid}`;

                return NextResponse.json({ message: 'Top-up successful', new_gems: newGems }, { status: 200 });
            }
            case "exchangeManyGems":
                try {
                    const essence = dataFetch.formData.essence;
                    const selectedEssence = dataFetch.selectedEssence;
                    console.log(essence);
                    console.log(selectedEssence);

                    // 1. Fetch user resources
                    const userResourcesResult = await sql<User_resources>`SELECT * FROM user_resources WHERE uid = ${uid}`;
                    const userResources = userResourcesResult.rows[0];

                    if (!userResources) {
                        return NextResponse.json({ message: 'user resource not found' }, { status: 404 });
                    }

                    // 2. Check if user has enough glamour gems
                    if (userResources.glamour_gems < 160) {
                        return NextResponse.json({ message: 'not enough glamour gems' }, { status: 400 });
                    }

                    // 3. Update user resources
                    let updatedGlamourGems = userResources.glamour_gems - (160 * essence);
                    let updatedShimmeringEssence = userResources.shimmering_essence;
                    let updatedGlimmeringEssence = userResources.glimmering_essence;

                    switch (selectedEssence) {
                        case "shimmering_essence":
                            updatedShimmeringEssence += essence;
                            break;
                        case "glimmering_essence":
                            updatedGlimmeringEssence += essence;
                            break;
                        default:
                            return NextResponse.json({ message: 'Invalid essence type' }, { status: 400 });
                    }

                    await sql`UPDATE user_resources 
                    SET glamour_gems = ${updatedGlamourGems}, 
                    shimmering_essence = ${updatedShimmeringEssence}, 
                    glimmering_essence = ${updatedGlimmeringEssence} 
                    WHERE uid = ${uid}
                `;

                    // 4. Return updated user resources
                    return NextResponse.json({ message: 'successed exchange essence' }, { status: 200 });

                } catch (error) {


                }
            // Add more cases for other fetch types as needed
            default:
                return NextResponse.json({ message: 'Invalid fetch type' }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'failed to process fetch' }, { status: 500 });
    }
}
