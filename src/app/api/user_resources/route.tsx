import { sql } from '@vercel/postgres';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await new Response(req.body).json(); 
    const { rows } = await sql`SELECT * FROM user_resources WHERE uid = ${uid}`;

    if (rows.length > 0) {
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      return NextResponse.json({ message: 'User resource not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user resource:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { uid } = params;
    const { Chic_Coins, Glamour_Gems, Glamour_Dust, Fashion_Tokens, Shimmering_Essence, Glimmering_Essence, pity, is_rate } = await new Response(req.body).json();

    const result = await sql`
      UPDATE user_resources
      SET Chic_Coins = ${Chic_Coins},
          Glamour_Gems = ${Glamour_Gems},
          Glamour_Dust = ${Glamour_Dust},
          Fashion_Tokens = ${Fashion_Tokens},
          Shimmering_Essence = ${Shimmering_Essence},
          Glimmering_Essence = ${Glimmering_Essence},
          pity = ${pity},
          is_rate = ${is_rate}
      WHERE uid = ${uid}
      RETURNING *
    `;

    if (result.rows.length > 0) {
      return NextResponse.json(result.rows[0], { status: 200 });
    } else {
      return NextResponse.json({ message: 'User resource not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error updating user resource:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { uid } = params;
    const result = await sql`DELETE FROM user_resources WHERE uid = ${uid}`;

    if (result.rowCount > 0) {
      return NextResponse.json({ message: 'User resource deleted' }, { status: 204 });
    } else {
      return NextResponse.json({ message: 'User resource not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting user resource:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}