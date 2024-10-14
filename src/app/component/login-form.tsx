import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ModalAlert from '@/app/component/ModalAlert';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [prevFormData, setPrevFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPrevFormData(formData);
  }, [formData]);

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('sessionToken');

      if (!token) {
        router.push('/');
      } else {
        try {
          const currentDate = new Date();
          const decodedToken = jwtDecode<{ exp: number }>(token);
          if (decodedToken.exp) {
            const isTokenExpired = decodedToken.exp * 1000 < currentDate.getTime();
            if (isTokenExpired) {
              sessionStorage.removeItem('sessionToken');
              router.push('/');
            } else {
              router.push('/main');
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          sessionStorage.removeItem('sessionToken');
          router.push('/');
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      sessionStorage.setItem('sessionToken', data.token);
      localStorage.setItem('user', data.user.username);
      sessionStorage.setItem('userId', data.user.uid);
      router.push('/main');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setIsModalOpen(true);
      setFormData(prevFormData);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    setError(null);
  };

  return (
    <div className='relative flex flex-none w-1/3 flex-col items-center justify-center gap-2'>
      <ModalAlert
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        title="Error"
        imageSrc="/ui/galat_img.svg"
      >
        <p>{error}</p>
      </ModalAlert>
      <form onSubmit={handleSubmit} className='flex flex-col flex-none w-1/2 items-center justify-center gap-4'>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className='flex flex-1 w-full rounded-md p-2 text-black text-sm lg:text-md'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className='flex flex-1 w-full rounded-md p-2 text-black text-sm lg:text-md'
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className='flex flex-1 gap-2 w-full justify-center items-center'>
          <Link href="/daftar">
            <p
              className="flex-1 bg-transparent border-2 border-white text-white font-bold p-2 rounded-lg hover:bg-white hover:text-green-500 transition-all duration-300">
              DAFTAR
            </p>
          </Link>
          <button
            type="submit"
            className="flex-1 bg-transparent border-2 border-white text-white font-bold p-2 rounded-lg hover:bg-white hover:text-blue-500 transition-all duration-300">
            MASUK
          </button>
        </div>
      </form>
      <p className='text-xs text-white font-sans pt-4'>Hazart Studio @2024</p>
    </div>
  );
};

export default Login;
