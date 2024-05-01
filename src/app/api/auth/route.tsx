import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  await pool.connect();
  const result = await pool.query('SELECT * FROM users WHERE email = email1@email.com');
  console.log(result)
  return new Response(`Hello from Hazart`, {status:200});
}

export async function POST(req: Request, res: NextApiResponse) {
    const { email, password } =  await new Response(req.body).json()

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return new Response('Invalid email or password', {status:401});
      }
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response('Invalid email or password', {status:401});
      }
      const token = jwt.sign({ userId: user.id }, 'your_secret_key');
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}
