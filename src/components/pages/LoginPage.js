'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import LoginFormModel from "@/components/auth/LoginFormModel";

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath || '/');
    }
  }, [router, redirectPath, isAuthenticated]);

  if (isAuthenticated) return null;

  return <LoginFormModel />;
};

export default LoginPage;