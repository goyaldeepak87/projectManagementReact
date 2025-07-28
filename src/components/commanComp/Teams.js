// import { Search } from 'lucide-react'; // optional: for search icon

import { useRouter,  } from "next/navigation";
import { AddPeopleModal } from "./CreateTeam";
import { useState } from "react";

const Teams = () => {
  const users = [
    { name: 'Deepak goyal', initials: 'DG', bg: 'bg-cyan-500' },
    { name: 'tarun@gmail.com', initials: 'T', bg: 'bg-blue-600' },
    { name: 'dsfdsf dsfdsf', initials: 'DD', bg: 'bg-purple-600' },
    { name: 'tarn', initials: 'T', bg: 'bg-cyan-500' },
  ];
  const router = useRouter();
  const [openAddPeopleModal, setOpenAddPeopleModal] = useState(false);
  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 border rounded-md cursor-pointer" onClick={() => {
            router.push("/users")
          }}>Manage users</button>
          <button style={{
            backgroundColor: "lab(64.272% 57.1788 90.3583)",
            transition: "background 0.2s",
          }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "lab(54% 57.1788 90.3583)"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "lab(64.272% 57.1788 90.3583)"}
            className="cursor-pointer text-white px-4 py-2 rounded" onClick={() => setOpenAddPeopleModal(true)}>Add people</button>
        </div>
      </div>

      {/* Search */}
      {/* <div className="relative mb-8">
        <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search teams"
          className="w-full pl-10 pr-4 py-2 border rounded-md outline-none"
        />
      </div> */}

      {/* People List */}
      <div>
        <h2 className="text-lg font-medium mb-4">People you work with</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white border rounded-lg shadow-sm p-4"
            >
              <div
                className={`w-20 h-20 rounded-full text-2xl font-semibold text-white flex items-center justify-center ${user.bg}`}
              >
                {user.initials}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 text-center">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
       {openAddPeopleModal && (
                      <AddPeopleModal open={openAddPeopleModal} onOpenChange={setOpenAddPeopleModal} />
                  )}
    </div>
  );
};

export default Teams;
