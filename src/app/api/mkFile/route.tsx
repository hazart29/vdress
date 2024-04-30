import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const blob = await put('data/dataPlayer.JSON', 'halo', {
    access: 'public',
  });
 
  return NextResponse.json(blob);
}