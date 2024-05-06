import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Get the session token from local storage
      const token = sessionStorage.getItem('sessionToken');

      if (!token) {
        router.push('/'); // Redirect to '/' page if no token found
      } else {
        try {
          const currentDate = new Date();
          // Decode the JWT token
          const decodedToken = jwtDecode(token);
          // Check if the token is expired
          if (decodedToken.exp) {
            const isTokenExpired = decodedToken.exp * 1000 < currentDate.getTime();
            if (isTokenExpired) {
              // Clear expired token from local storage
              localStorage.removeItem('sessionToken');
              router.push('/'); // Redirect to '/' page if token is expired
            } else {
              router.push('/main'); // Redirect to '/main' page if token is valid
            }
          }
        } catch (error) {
          // Handle any errors (e.g., invalid token format)
          console.error('Error decoding token:', error);
          // Clear invalid token from local storage
          localStorage.removeItem('sessionToken');
          router.push('/'); // Redirect to '/' page
        }
      }
    };

    checkAuth();
  }, [router]);


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
      sessionStorage.setItem('sessionToken', data.token);
      localStorage.setItem('user', data.user.username);
      router.push('/main');
      // Redirect or perform any other action after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='flex flex-col flex-1 items-center justify-center gap-2'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
        <input
          type="email"
          placeholder="Email"
          className='flex rounded-md p-2 text-black text-xs lg:text-md'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className='flex rounded-md p-2 text-black text-xs lg:text-md'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="transform hover:scale-110 ease-in-out hover:text-orange-700 flex rounded-lg bg-gradient-to-r hover:from-orange-400 from-orange-500 hover:to-red-400 to-red-500 p-4 text-orange-300 font-bold text-xs :text-lg">Login</button>
      </form>
      <p className='text-xs text-white opacity-50 font-sans pt-4'>Hazart Studio @2024</p>
    </div>
  );
};

export default Login;
