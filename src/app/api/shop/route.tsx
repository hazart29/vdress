import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { GachaItem, User_resources } from "@/app/interface";
import sjcl from "sjcl";
import { NextResponse } from "next/server";

const password = process.env.SJCL_PASSWORD; // Retrieve password from environment variables

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products`;
    return NextResponse.json({ message: 'successful', rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { encryptedData } = await req.json();
    const decryptedData = JSON.parse(sjcl.decrypt(password as string, encryptedData));
    const { uid, typeFetch, ...dataFetch } = decryptedData;

    switch (typeFetch) {
      case "getGlamourGems": {
        const { rows: [userResources] } = await sql<User_resources>`SELECT * FROM user_resources WHERE uid = ${uid}`;
        return NextResponse.json({ message: 'Successful', userResources: userResources || 0 }, { status: 200 });
      }

      case "topUp": {
        const { packageId } = dataFetch;

        try {
          const { rows: [packageInfo] } = await sql`SELECT glamour_gems FROM products WHERE id = ${packageId}`;
          if (!packageInfo) {
            return NextResponse.json({ message: 'Package not found' }, { status: 404 });
          }

          const { rows: [userGems] } = await sql`SELECT glamour_gems FROM user_resources WHERE uid = ${uid}`;
          if (!userGems) {
            return NextResponse.json({ error: 'user_resources not found' }, { status: 404 });
          }

          const newGems = userGems.glamour_gems + packageInfo.glamour_gems;
          await sql`UPDATE user_resources SET glamour_gems = ${newGems} WHERE uid = ${uid}`;

          return NextResponse.json({ message: 'Top-up successful', newGems: newGems }, { status: 200 });
        } catch (error) {
          console.error('Error during top-up:', error);
          return NextResponse.json({ message: 'Top-up failed' }, { status: 500 });
        }
      }

      case "exchangeManyGems": {
        const { essence, selectedEssence } = dataFetch;

        try {
          const { rows: [userResources] } = await sql<User_resources>`SELECT * FROM user_resources WHERE uid = ${uid}`;
          if (!userResources) {
            return NextResponse.json({ message: 'user resource not found' }, { status: 404 });
          }

          if (userResources.glamour_gems < 160) {
            return NextResponse.json({ message: 'Not enough glamour gems' }, { status: 400 });
          }

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
                     WHERE uid = ${uid}`;

          return NextResponse.json({ message: 'Successed exchange essence' }, { status: 200 });
        } catch (error) {
          console.error('Error during essence exchange:', error);
          return NextResponse.json({ message: 'Essence exchange failed' }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ message: 'Invalid fetch type' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to process fetch' }, { status: 500 });
  }
}