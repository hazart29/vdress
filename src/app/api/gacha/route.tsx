import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const rows = await sql`SELECT * FROM gacha_item`;

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
        const userId = url.searchParams.get('userId');
        const typeFetch = url.searchParams.get('typeFetch');

        if (!userId || !typeFetch) {
            return NextResponse.json({ message: 'userId and typeFetch are required' }, { status: 400 });
        }

        switch (typeFetch) {
            case 'updatePrimo':
                try {
                    const glamourGems = parseInt(url.searchParams.get('glamour_gems') || '0', 10); // <--- Perbaikan di sini
                    if (isNaN(glamourGems)) {
                        return NextResponse.json({ message: 'Invalid glamour_gems value' }, { status: 400 });
                    }

                    // Validasi userId (contoh)
                    if (!userId || userId.length < 3) {
                        return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
                    }

                    const { rows: primoRows } = await sql`SELECT glamour_gems FROM user_resources WHERE uid = ${userId}`;

                    if (primoRows.length === 0) {
                        return NextResponse.json({ message: 'User resources not found' }, { status: 404 });
                    }

                    const currentGlamourGems = primoRows[0].glamour_gems;
                    const newGlamourGems = currentGlamourGems - glamourGems; // <--- Perbaikan di sini
                    await sql`UPDATE user_resources SET glamour_gems = ${newGlamourGems} WHERE uid = ${userId}`; // <--- Perbaikan di sini
                    return NextResponse.json({ message: 'glamour_gems updated successfully' }, { status: 200 });

                } catch (error) {
                    console.error('Error updating glamour_gems:', error);
                    return NextResponse.json({ message: 'Failed to update glamour_gems', error: error }, { status: 500 });
                }
            case 'resetPity':
                const { rows: resetRows } = await sql`SELECT * FROM user_resources WHERE uid = ${userId}`;
                if (resetRows.length > 0) {
                    await sql`UPDATE user_resources SET pity = 0 WHERE uid = ${userId}`;
                    return NextResponse.json({ message: 'pity updated to 0 successfully' }, { status: 200 });
                } else {
                    return NextResponse.json({ message: 'user not found' }, { status: 404 });
                }

            case 'incPity':
                const incPity = parseInt(url.searchParams.get('incPity') || '0', 10);
                if (isNaN(incPity)) {
                    return NextResponse.json({ message: 'Invalid incPity value' }, { status: 400 });
                }
                const { rows: incRows } = await sql`SELECT pity FROM user_resources WHERE uid = ${userId}`;
                if (incRows.length > 0) {
                    await sql`UPDATE user_resources SET pity = ${incPity} WHERE uid = ${userId}`;
                    return NextResponse.json({ message: 'pity updated successfully' }, { status: 200 });
                } else {
                    return NextResponse.json({ message: 'pity not updated' }, { status: 200 });
                }

            case 'upInven':
                try {
                    const userId = url.searchParams.get('userId');
                    const rarity = url.searchParams.get('rarity');
                    const item_name = url.searchParams.get('item_name');
                    const part_outfit = url.searchParams.get('part_outfit');
                    const layer = url.searchParams.get('layer');

                    if (!item_name || !rarity || !part_outfit || !layer) {
                        return NextResponse.json({ message: 'item_name, rarity, part_outfit, and layer are required' }, { status: 400 });
                    }

                    await sql`INSERT INTO inventory (uid, rarity, item_name, part_outfit, layer) 
                              VALUES (${userId}, ${rarity}, ${item_name}, ${part_outfit}, ${layer});`;

                    return NextResponse.json({ message: `${item_name}, push successfully` }, { status: 200 });

                } catch (error) {
                    console.error('Error updating inventory:', error);
                    return NextResponse.json({ message: 'Error updating inventory' }, { status: 500 });
                }

            case 'getPity':
                try {
                    const { rows: getPityRows } = await sql`SELECT pity FROM user_resources WHERE uid = ${userId}`;
                    return NextResponse.json(getPityRows, { status: 200 });
                } catch (error) {
                    console.error('Error fetching pity:', error);
                    return NextResponse.json({ message: 'Failed to fetch pity', error: error }, { status: 500 });
                }

            case 'getRateUpItem':
                const getRarity = url.searchParams.get('rarity');
                if (!getRarity) {
                    return NextResponse.json({ message: 'rarity is required' }, { status: 400 });
                }
                const { rows: getLimitedRows } = await sql`SELECT * FROM gacha_item WHERE rarity = ${getRarity} AND rate_up = true`;
                return NextResponse.json(getLimitedRows, { status: 200 });

            case 'getRateOffItem':
                const getOffRarity = url.searchParams.get('rarity');
                if (!getOffRarity) {
                    return NextResponse.json({ message: 'rarity is required' }, { status: 400 });
                }
                const { rows: getOffRows } = await sql`SELECT * FROM gacha_item WHERE rarity = ${getOffRarity} AND rate_up = false`;
                return NextResponse.json(getOffRows, { status: 200 });

            case 'getRateOn':
                const { rows: rateOnRows } = await sql`SELECT is_rate FROM user_resources WHERE uid = ${userId}`;
                return NextResponse.json(rateOnRows[0].is_rate, { status: 200 });

            case 'setRateOn':
                await sql`UPDATE user_resources SET is_rate = true WHERE uid = ${userId}`;
                return NextResponse.json({ message: 'is_rate set to true successfully' }, { status: 200 });

            case 'setRateOff':
                await sql`UPDATE user_resources SET is_rate = false WHERE uid = ${userId}`;
                return NextResponse.json({ message: 'is_rate set to false successfully' }, { status: 200 });

            case 'getGachaItem':
                const getGachaRarity = url.searchParams.get('rarity');
                if (!getGachaRarity) {
                    return NextResponse.json({ message: 'rarity is required' }, { status: 400 });
                }
                const { rows: getGachaRows } = await sql`SELECT * FROM gacha_item WHERE rarity = ${getGachaRarity}`;
                return NextResponse.json(getGachaRows, { status: 200 });

            case 'getUserData':
                try {
                    const user = await sql`SELECT * FROM users WHERE uid = ${userId}`;
                    const inventory = await sql`SELECT * FROM inventory WHERE uid = ${userId}`;
                    const userResources = await sql`SELECT * FROM user_resources WHERE uid = ${userId}`;
                    const suited = await sql`SELECT * FROM suited WHERE uid = ${userId}`;

                    if (user.rows.length === 0) {
                        return NextResponse.json({ message: 'User not found' }, { status: 404 });
                    }

                    const userData = {
                        ...user.rows[0],
                        inventory: inventory.rows,
                        user_resources: userResources.rows,
                        suited: suited.rows,
                    };

                    return NextResponse.json(userData, { status: 200 });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
                }

            case 'getHistory':
                try {
                    const history = await sql`SELECT * FROM gacha_history_a WHERE uid = ${userId}`;
                    return NextResponse.json(history.rows, { status: 200 });
                } catch (error) {
                    console.error('Error fetching history:', error);
                    return NextResponse.json({ message: 'Error fetching history' }, { status: 500 });
                }

            case 'upHistoryA':
                try {
                    const item_name = url.searchParams.get('item_name');
                    const rarity = url.searchParams.get('rarity');
                    const part_outfit = url.searchParams.get('part_outfit');
                    const gacha_type = url.searchParams.get('gacha_type');

                    if (!item_name || !rarity || !part_outfit || !gacha_type) {
                        return NextResponse.json({ message: 'item_name, rarity, part_outfit, and gacha_type are required' }, { status: 400 });
                    }
                    await sql`
                          INSERT INTO gacha_history_a (uid, rarity, item_name, part_outfit, gacha_type) 
                          VALUES (${userId}, ${rarity}, ${item_name}, ${part_outfit}, ${gacha_type});
                        `;

                    return NextResponse.json({ message: `${item_name} push successfully` }, { status: 200 });
                } catch (error) {
                    console.error('Error adding history:', error);
                    return NextResponse.json({ message: 'Error adding history' }, { status: 500 });
                }

            default:
                return NextResponse.json({ message: 'Invalid typeFetch' }, { status: 400 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "internalError", message: 'Internal server error', errorCode: 500 }, { status: 500 });
    }
}