// pages/api/auth/session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession();
    if (session) {
        // Jika sesi ditemukan, kirimkan data sesi
        res.status(200).json({ session });
    } else {
        // Jika sesi tidak ditemukan, kirimkan pesan bahwa pengguna belum masuk
        res.status(401).json({ message: 'User is not authenticated' });
    }
}