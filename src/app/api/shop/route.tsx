import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { DustItems, GachaItem, TokenItems, User_resources } from "@/app/interface";
import sjcl from "sjcl";
import { NextResponse } from "next/server";

const password = process.env.SJCL_PASSWORD; // Retrieve password from environment variables

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM products`;
    return new NextResponse(JSON.stringify({ message: 'successful', rows }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
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
      case "getUserResource": {
        const { rows: [userResources] } = await sql<User_resources>`SELECT * FROM user_resources WHERE uid = ${uid}`;
        return NextResponse.json({ message: 'Successful', userResources: userResources || 0 }, { status: 200 });
      }
      case "getTokenItems": {
        const { rows: tokenItems } = await sql<TokenItems[]>`SELECT * FROM token_items`;
        return NextResponse.json({ message: 'Successful', tokenItems: tokenItems || [] }, { status: 200 });
      }
      case "getDustItems": {
        try {
          const { rows: dustItems } = await sql<DustItems[]>`SELECT * FROM dust_items ORDER BY id`; // Maintain sorting if needed
          const returnData = { dustItems: dustItems || [] };
          const encryptedReturnData = sjcl.encrypt(password as string, JSON.stringify(returnData));
          return NextResponse.json({ message: 'Successful', encryptedData: encryptedReturnData }, { status: 200 });
        } catch (error) {
          console.error("Error fetching dust items:", error);
          return NextResponse.json({ message: 'Failed to fetch dust items' }, { status: 500 });
        }
      }
      case "restockTokenItems": {
        await sql`UPDATE token_items SET "limit" = initial_limit WHERE id IN (3, 4, 5);`; // Gunakan "limit" dengan double quotes
        return NextResponse.json({ message: 'Successful update' }, { status: 200 });
      }
      case "restockDustItems": {
        await sql`UPDATE dust_items SET "limit" = initial_limit WHERE id IN (3, 4, 5);`; // Gunakan "limit" dengan double quotes
        return NextResponse.json({ message: 'Successful update' }, { status: 200 });
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

      case "buyTokenItem": {
        const { itemId, quantity } = dataFetch;

        if (!itemId || !quantity || quantity <= 0) {
          return NextResponse.json({ message: 'Invalid item or quantity' }, { status: 400 });
        }

        try {
          await sql`BEGIN`;

          const { rows: [item] } = await sql<TokenItems>`SELECT name, price, "limit" FROM token_items WHERE id = ${itemId}`;
          if (!item) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
          }

          const { rows: [userResources] } = await sql<User_resources>`SELECT fashion_tokens, shimmering_essence, glimmering_essence FROM user_resources WHERE uid = ${uid}`;
          if (!userResources) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'User resources not found' }, { status: 404 });
          }

          const totalPrice = item.price * quantity;

          if (userResources.fashion_tokens < totalPrice) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Not enough fashion tokens' }, { status: 400 });
          }

          if (item.limit !== null && item.limit < quantity) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Not enough stock' }, { status: 400 });
          }

          // Update fashion_tokens
          const newTokens = userResources.fashion_tokens - totalPrice;
          await sql`UPDATE user_resources SET fashion_tokens = ${newTokens} WHERE uid = ${uid}`;

          if (itemId === 1) {
            // Add to shimmering_essence
            const newEssence = userResources.shimmering_essence + quantity;
            await sql`UPDATE user_resources SET shimmering_essence = ${newEssence} WHERE uid = ${uid}`;
          } else if (itemId === 2) {
            // Add to glimmering_essence
            const newEssence = userResources.glimmering_essence + quantity;
            await sql`UPDATE user_resources SET glimmering_essence = ${newEssence} WHERE uid = ${uid}`;
          } else if ([3, 4, 5].includes(itemId)) {
            // Add to inventory
            const { rows: gachaItems } = await sql<GachaItem>`SELECT rarity, part_outfit, layer FROM gacha_item WHERE item_name = ${item.name}`;

            if (gachaItems.length > 0) { //check if gacha item exist
              for (let i = 0; i < quantity; i++) {
                await sql`INSERT INTO inventory (uid, rarity, item_name, part_outfit, layer, created_at)
                        VALUES (${uid}, ${gachaItems[0].rarity}, ${item.name}, ${gachaItems[0].part_outfit}, ${gachaItems[0].layer}, NOW())`;
              }
            } else {
              await sql`ROLLBACK`;
              return NextResponse.json({ message: 'Gacha Item not found' }, { status: 404 });
            }
          }

          if (item.limit !== null) {
            const newLimit = item.limit - quantity;
            await sql`UPDATE token_items SET "limit" = ${newLimit} WHERE id = ${itemId}`;
          }

          await sql`COMMIT`;

          return NextResponse.json({ message: 'Purchase successful' }, { status: 200 });
        } catch (dbError) {
          await sql`ROLLBACK`;
          console.error('Database error during purchase:', dbError);
          return NextResponse.json({ message: 'Purchase failed due to a database error' }, { status: 500 });
        }
      }

      case "buyDustItem": {
        const { itemId, quantity } = dataFetch;

        if (!itemId || !quantity || quantity <= 0) {
          return NextResponse.json({ message: 'Invalid item or quantity' }, { status: 400 });
        }

        try {
          await sql`BEGIN`;

          const { rows: [item] } = await sql<DustItems>`SELECT name, price, "limit" FROM dust_items WHERE id = ${itemId} ORDER BY id`;
          if (!item) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
          }

          const { rows: [userResources] } = await sql<User_resources>`SELECT glamour_dust, shimmering_essence, glimmering_essence FROM user_resources WHERE uid = ${uid}`;
          if (!userResources) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'User resources not found' }, { status: 404 });
          }

          const totalPrice = item.price * quantity;

          if (userResources.glamour_dust < totalPrice) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Not enough glamour dust' }, { status: 400 });
          }

          if (item.limit !== null && item.limit < quantity) {
            await sql`ROLLBACK`;
            return NextResponse.json({ message: 'Not enough stock' }, { status: 400 });
          }

          // Update fashion_tokens
          const newDusts = userResources.glamour_dust - totalPrice;
          await sql`UPDATE user_resources SET glamour_dust = ${newDusts} WHERE uid = ${uid}`;

          if (itemId === 1) {
            // Add to shimmering_essence
            const newEssence = userResources.shimmering_essence + quantity;
            await sql`UPDATE user_resources SET shimmering_essence = ${newEssence} WHERE uid = ${uid}`;
          } else if (itemId === 2) {
            // Add to glimmering_essence
            const newEssence = userResources.glimmering_essence + quantity;
            await sql`UPDATE user_resources SET glimmering_essence = ${newEssence} WHERE uid = ${uid}`;
          }

          if (item.limit !== null) {
            const newLimit = item.limit - quantity;
            await sql`UPDATE dust_items SET "limit" = ${newLimit} WHERE id = ${itemId}`;
          }

          await sql`COMMIT`;

          const returnData = {
            id: itemId, // Kirim ID item yang dibeli
            limit: item.limit !== null ? item.limit - quantity : null, // Limit setelah pembelian
          };

          const encryptedReturnData = sjcl.encrypt(password as string, JSON.stringify(returnData));
          return NextResponse.json({ message: 'Purchase successful', encryptedData: encryptedReturnData }, { status: 200 });
        } catch (dbError) {
          await sql`ROLLBACK`;
          console.error('Database error during purchase:', dbError);
          return NextResponse.json({ message: 'Purchase failed due to a database error' }, { status: 500 });
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