// pages/api/update.js
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export function handler(req: Request, res: NextResponse) {
  if (req.method === 'POST') {
    const { primogems } = req.body;

    // Define the path to the JSON file
    const filePath = path.resolve('./public/data/', 'dataPlayer.json');

    // Read the file
    const fileData = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data
    const data = JSON.parse(fileData);

    // Update the data
    data.primogems = primogems;

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    NextResponse.json({ message: 'Data updated successfully' }, {status: 200});
  } else {
    NextResponse.json({ message: 'Method not allowed' }, {status: 405});
  }
}