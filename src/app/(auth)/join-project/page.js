'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getVerifyProject } from '@/utils/APIs';

const JoinProjectPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=/join-project?token=${token}`);
    }
  }, [isAuthenticated, router, token]);

  // Verify project token on login
  useEffect(() => {
    const verify = async () => {
      if (!isAuthenticated || !token) return;

      try {
        const result = await getVerifyProject({ token });
        router.replace('/');
      } catch (error) {
        console.error("❌ Project verification failed:", error);
        // Optional: redirect or show error UI
        router.replace('/error?message=project-verification-failed');
      }
    };

    verify();
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Verifying project invitation...</h1>
    </div>
  );
};

export default JoinProjectPage;
