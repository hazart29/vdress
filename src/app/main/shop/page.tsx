// app/shop/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/main/shop/gacha-exchange');
  }, [router]);

  return (
    <div>
      Redirecting to Glimmering Exchange...
    </div>
  );
};

export default Page;