import fs from 'fs';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import path from 'path';

export function GET(request: Request) {
  return new Response(`Hello from Hazart`);
}

export async function POST(req: Request) {
  'use server'
  const reqData =  await new Response(req.body).json()
  console.log(reqData);

  // Define the path to the JSON file
  const filePath = path.join(process.cwd(), '/public/data/dataPlayer.json');
  console.log(filePath);

  // Read the file
  const fileData = fs.readFileSync(filePath, 'utf8');

  // Parse the JSON data
  const data = JSON.parse(fileData);

  // Update the data
  const writeDT = data.players.primogems -= reqData.primogems;
  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(data));
  if (writeDT) {
    return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}