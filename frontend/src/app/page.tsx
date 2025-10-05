'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui-navbar/navbar';
import Hero from '@/components/ui/hero';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}
