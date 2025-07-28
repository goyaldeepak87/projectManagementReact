'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import SideBar from "@/components/commanComp/SideBar";

export default function ProtectedLayout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login'); // Redirect to login page
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don’t show layout while redirecting
  }

  return (
    <div className="flex h-screen">
      <div className="w-[19%]">
        <SideBar />
      </div>
      <div className="w-[81%]">
        {children}
      </div>
    </div>
  );
}
