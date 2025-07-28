'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import SideBar from "@/components/commanComp/SideBar";
import NotFoundProject from '@/components/commanComp/NotFoundProject';
import { FilePlus } from 'react-feather';
import { CreateProjectModel } from '@/components/commanComp/CreateProjectModel';

export default function ProtectedLayout({ children }) {
  const [openProjectModel, setOpenProjectModel] = useState(false);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
          {/* Lock Icon Circle */}
          <div className="mb-6">
            <FilePlus
              width={140}
              height={140}
              color='#0f172a'
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            <button style={{
              backgroundColor: "lab(64.272% 57.1788 90.3583)",
              transition: "background 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "lab(54% 57.1788 90.3583)"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "lab(64.272% 57.1788 90.3583)"}
              className="cursor-pointer text-white px-6 py-2 mb-2 rounded" onClick={() => setOpenProjectModel((prev) => !prev)}>Add Project</button>
          </h1>
          {/* Message */}
          <p className="text-gray-600 max-w-md text-sm">
            Efficiently manage and track project progress, assign tasks, set deadlines, and collaborate with team members using organized workflows.
          </p>
        </div>
      </div>
      {openProjectModel && (
        <CreateProjectModel
          open={openProjectModel}
          onOpenChange={setOpenProjectModel} // <-- FIXED: Properly pass the setter
        />
      )}
    </div>
  );
}
