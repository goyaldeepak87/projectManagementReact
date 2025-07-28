import { getMyProjectAllTeams } from '@/utils/APIs';
import { useEffect, useState } from 'react';

const usersData = [
    {
        name: 'Deepak goyal',
        email: 'goyaldeepak871@gmail.com',
        role: 'Organization admin',
        initials: 'DG',
        status: 'ACTIVE',
        lastSeen: 'Jul 23, 2025',
        bg: 'bg-cyan-500',
    },
    {
        name: 'dsfdsf dsfdsf',
        email: 'dfsdf@gmail.com',
        initials: 'DD',
        status: 'INVITED',
        lastSeen: 'Invited yesterday',
        bg: 'bg-purple-600',
    },
    {
        name: 'tarn',
        email: 'tarn@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 23 hours ago',
        bg: 'bg-cyan-500',
    },
    {
        name: 'tarun@gmail.com (tarun)',
        email: 'tarun@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 2 days ago',
        bg: 'bg-blue-600',
    },
    {
        name: 'Deepak goyal',
        email: 'goyaldeepak871@gmail.com',
        role: 'Organization admin',
        initials: 'DG',
        status: 'ACTIVE',
        lastSeen: 'Jul 23, 2025',
        bg: 'bg-cyan-500',
    },
    {
        name: 'dsfdsf dsfdsf',
        email: 'dfsdf@gmail.com',
        initials: 'DD',
        status: 'INVITED',
        lastSeen: 'Invited yesterday',
        bg: 'bg-purple-600',
    },
    {
        name: 'tarn',
        email: 'tarn@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 23 hours ago',
        bg: 'bg-cyan-500',
    },
    {
        name: 'tarun@gmail.com (tarun)',
        email: 'tarun@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 2 days ago',
        bg: 'bg-blue-600',
    },
    {
        name: 'Deepak goyal',
        email: 'goyaldeepak871@gmail.com',
        role: 'Organization admin',
        initials: 'DG',
        status: 'ACTIVE',
        lastSeen: 'Jul 23, 2025',
        bg: 'bg-cyan-500',
    },
    {
        name: 'dsfdsf dsfdsf',
        email: 'dfsdf@gmail.com',
        initials: 'DD',
        status: 'INVITED',
        lastSeen: 'Invited yesterday',
        bg: 'bg-purple-600',
    },
    {
        name: 'tarn',
        email: 'tarn@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 23 hours ago',
        bg: 'bg-cyan-500',
    },
    {
        name: 'tarun@gmail.com (tarun)',
        email: 'tarun@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 2 days ago',
        bg: 'bg-blue-600',
    },
    {
        name: 'Deepak goyal',
        email: 'goyaldeepak871@gmail.com',
        role: 'Organization admin',
        initials: 'DG',
        status: 'ACTIVE',
        lastSeen: 'Jul 23, 2025',
        bg: 'bg-cyan-500',
    },
    {
        name: 'dsfdsf dsfdsf',
        email: 'dfsdf@gmail.com',
        initials: 'DD',
        status: 'INVITED',
        lastSeen: 'Invited yesterday',
        bg: 'bg-purple-600',
    },
    {
        name: 'tarn',
        email: 'tarn@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 23 hours ago',
        bg: 'bg-cyan-500',
    },
    {
        name: 'tarun@gmail.com (tarun)',
        email: 'tarun@gmail.com',
        initials: 'T',
        status: 'INVITED',
        lastSeen: 'Invited 2 days ago',
        bg: 'bg-blue-600',
    },
];

const bgColors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-orange-500',
];

const getRandomColor = () => {
    const index = Math.floor(Math.random() * bgColors.length);
    return bgColors[index];
};

export default function Users() {
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [myAllteamsMember, setMyAllteamsMember] = useState([]);

    const totalPages = Math.ceil(myAllteamsMember.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = myAllteamsMember.slice(startIndex, endIndex);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1); // reset to first page on limit change
    };
    useEffect(() => {
        const fetchAllteamsMember = async () => {
            try {
                const AllteamsMember = await getMyProjectAllTeams();
                setMyAllteamsMember(AllteamsMember?.data?.result || []);
                console.log("Fetched Projects:", AllteamsMember);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchAllteamsMember();
    }, []);
    console.log("myAllteamsMember", myAllteamsMember)
    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Showing results ↻</h2>

            <table className="min-w-full text-sm border rounded overflow-hidden">
                <thead className="bg-gray-100 text-left text-gray-700 font-semibold">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Project</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Last seen</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {myAllteamsMember?.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-4 flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user.bg || getRandomColor()}`}
                                >
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.split('@')[0].slice(0, 1)}
                                    {console.log("user initials", user?.name?.split(' ').map(n => n[0]).join('').toUpperCase())}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{user?.name || (user?.email?.split('@')[0].slice(0, 15))}</div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                    {user?.role && <div className="text-xs text-gray-400">{user?.role}</div>}
                                </div>
                            </td>
                            <td className="p-4 text-gray-800">
                                {user?.projectName || '—'}
                            </td>
                            <td className="p-4">
                                {user.status === 'active' ? (
                                    <span className="text-green-700 bg-green-100 px-2 py-1 rounded-md text-xs font-semibold">
                                        ACTIVE
                                    </span>
                                ) : (
                                    <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs font-semibold">
                                        INVITED
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-gray-700">
                                {new Date(user?.createdAt).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </td>
                            <td className="p-4 text-right text-gray-500">
                                <button className="hover:text-gray-700">⋯</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                    <button
                        className="px-2 py-1 border rounded disabled:opacity-50"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        &lt; Previous
                    </button>
                    <button
                        className="px-2 py-1 border rounded"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Next &gt;
                    </button>
                    <span>
                        {startIndex + 1}–{Math.min(endIndex, myAllteamsMember.length)} of {myAllteamsMember.length}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span>Results per page:</span>
                    <select
                        className="border px-2 py-1 rounded text-sm outline-none"
                        value={perPage}
                        onChange={handlePerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
