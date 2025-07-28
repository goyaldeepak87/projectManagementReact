'use client';

import GifComp from "@/components/commanComp/GifComp";
import { LoginData } from "@/lang";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();
  const routeName = pathname.split('/')[1]; // Get "join-project" if path is /join-project

  const hideLayoutForRoutes = ['join-project']; // Add more routes if needed

  if (hideLayoutForRoutes.includes(routeName)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b]">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b]">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        {/* Left Section - Login Form */}
        {children}

        {/* Right Section - Illustration */}
        <div className="w-1/2 hidden lg:flex items-center justify-center">
          <GifComp {...LoginData} />
        </div>
      </div>
    </div>
  );
}
