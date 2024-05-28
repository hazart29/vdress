import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [prevFormData, setPrevFormData] = useState<FormData>({ email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    setPrevFormData(formData);
  }, [formData]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
      // Reset fields to previous values on error
      setFormData(prevFormData);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className='flex rounded-md p-2 text-black text-sm lg:text-md'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className='flex rounded-md p-2 text-black text-sm lg:text-md'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className='flex md:flex-row flex-col gap-2 w-full justify-center items-center'>
          <Link href="/daftar">
            <button
              className="flex-1 bg-transparent border-2 border-white text-white font-bold p-2 rounded-lg hover:bg-white hover:text-green-500 transition-all duration-300">
              DAFTAR
            </button>
          </Link>
          <button
            type="submit"
            className="flex-1 bg-transparent border-2 border-white text-white font-bold p-2 rounded-lg hover:bg-white hover:text-blue-500 transition-all duration-300">
            MASUK
          </button>
        </div>

      </form>
      <p className='text-xs text-white opacity-50 font-sans pt-4'>Hazart Studio @2024</p>
    </div>
  );
};

export default Login;
