'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import RegisterFormModel from '@/components/auth/RegisterFormModel';

export default function VerifyAndJoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  // Optional: Check if token exists
  if (!token) {
    return <div className="text-red-500 p-4">Invalid or missing token.</div>;
  }

  return (
    <RegisterFormModel isVerifyJoin={true} token={token} />
  );
}
