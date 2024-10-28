// import { sql } from '@vercel/postgres';
// import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//     try {
//         const url = new URL(req.url);
//         const userId = url.searchParams.get('userId');
//         const typeFetch = url.searchParams.get('typeFetch');

//         if (!userId || !typeFetch) {
//             return NextResponse.json({ message: 'userId and typeFetch are required' }, { status: 400 });
//         }

//         switch (typeFetch) {
//             // ... (kode untuk typeFetch lainnya)

//             case 'getUserData':
//                 try {
//                     const user = await sql`SELECT * FROM users WHERE uid = ${userId}`;
//                     const inventory = await sql`SELECT * FROM inventory WHERE uid = ${userId}`;
//                     const userResources = await sql`SELECT * FROM user_resources WHERE uid = ${userId}`;
//                     const suited = await sql`SELECT * FROM suited WHERE uid = ${userId}`;

//                     if (user.rows.length === 0) {
//                         return NextResponse.json({ message: 'User not found' }, { status: 404 });
//                     }

//                     const userData = {
//                         ...user.rows[0],
//                         inventory: inventory.rows,
//                         user_resources: userResources.rows,
//                         suited: suited.rows,
//                     };

//                     return NextResponse.json(userData, { status: 200 });
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                     return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
//                 }

//             case 'deleteItemFromInventory':
//                 try {
//                     await sql`DELETE FROM inventory WHERE uid = ${userId}`;

//                     return NextResponse.json({ message: 'Item deleted from inventory successfully' }, { status: 200 });
//                 } catch (error) {
//                     console.error('Error deleting item from inventory:', error);
//                     return NextResponse.json({ message: 'Failed to delete item from inventory', error: error }, { status: 500 });
//                 }

//             case 'deleteGachaHistory':
//                 try {
//                     await sql`DELETE FROM gacha_history_a WHERE uid = ${userId}`;

//                     return NextResponse.json({ message: 'Gacha history deleted successfully' }, { status: 200 });
//                 } catch (error) {
//                     console.error('Error deleting gacha history:', error);
//                     return NextResponse.json({ message: 'Failed to delete gacha history', error: error }, { status: 500 });
//                 }

//             default:
//                 return NextResponse.json({ message: 'Invalid typeFetch' }, { status: 400 });
//         }

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ status: "internalError", message: 'Internal server error', errorCode: 500 }, { status: 500 });
//     }
// }