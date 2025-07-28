import React from "react";
import Image from 'next/image';
import notfoundproj from '@/imgs/notfoundproj.svg';

const NotFoundProject = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
            {/* Lock Icon Circle */}
            <div className="mb-6">
                <Image
                    src={notfoundproj}
                    alt="Logo"
                    width={35}
                    height={35}
                    className="w-35 h-35 rounded-full"
                />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Project not found
            </h1>

            {/* Message */}
            <p className="text-gray-600 max-w-md text-sm">
                You tried to access a project that doesn{`'`}t exist, or that you don{`'`}t have permission to access. Speak to your Jira admin or Project admin to get access.
            </p>
        </div>
    );
};

export default NotFoundProject;
