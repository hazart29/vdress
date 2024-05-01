import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/main');
      // Redirect or perform any other action after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
        <input
          type="email"
          placeholder="Email"
          className='flex rounded-md p-2'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className='flex rounded-md p-2'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="transform hover:scale-110 ease-in-out hover:text-orange-700 flex rounded-lg bg-gradient-to-r hover:from-orange-400 from-orange-500 hover:to-red-400 to-red-500 p-4 text-2xl text-orange-300 font-bold">Login</button>
      </form>
      <p className='text-xs text-white opacity-50 font-sans pt-4'>Hazart Studio @2024</p>
    </div>
  );
};

export default Login;
