'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/imgs/logo2.png';
import roket from '@/imgs/roket1.png';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  LogIn,
  MoreHorizontal,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from 'react-feather';
import { CreateProjectModel } from './CreateProjectModel';
import { AddPeopleModal } from './CreateTeam';
import { useRouter } from 'next/navigation';
import { deleteProject , getAllMyProjects } from '@/utils/APIs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/reudux/slice/authSlice';
import { toast } from 'react-toastify';

const SideBar = () => {
  const [openProjectModel, setOpenProjectModel] = useState(false);
  const [openProjectsDropdown, setOpenProjectsDropdown] = useState(false);
  const [openAddPeopleModal, setOpenAddPeopleModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [project, setProject] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getAllMyProjects();
        setProject(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [openProjectModel]);

  const isAdmin = user?.role !== 'member';

  const handleDeleteProject = async (projectId) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this project?");
      if (!confirmed) return;

      await deleteProject (projectId);
      toast.success('Project deleted successfully!');

      // Re-fetch project list
      const updatedProjects = await getAllMyProjects();
      setProject(updatedProjects);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="fixed h-screen w-72 bg-[#0f172a] text-white flex flex-col justify-between">
      {/* Logo */}
      <div className="p-4 flex items-center space-x-2 mb-3">
        <div className="flex bg-gradient-to-tr rounded-full">
          <Image src={Logo} alt="Logo" width={70} height={70} />
        </div>
        <span className="text-lg text-center font-semibold [font-size:23px]">Project <br /> Management</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem text="Dashboard" active />

        <SidebarItem
          text="Projects"
          hover={isAdmin ? "Create Project" : null}
          count={isAdmin ? <Plus width={16} height={16} /> : null}
          icon={<ChevronDown />}
          project={project}
          onClick={() => setOpenProjectsDropdown((prev) => !prev)}
          onCountClick={(e) => {
            e.stopPropagation();
            setOpenProjectModel(true);
          }}
          onAddPeopleClick={(selected) => {
            setSelectedProject(selected);
            setOpenAddPeopleModal(true);
          }}
          onDeleteProjectClick={handleDeleteProject}
          dropdownOpen={openProjectsDropdown}
          showMenu={isAdmin}
        />

        {/* 👇 Only show Teams if admin */}
        {isAdmin && (
          <SidebarItem
            text="Teams"
            route="/teams"
            hover="Add people"
            count={<Plus width={16} height={16} />}
            onCountClick={() => setOpenAddPeopleModal(true)}
          />
        )}

        <div className="mt-6 text-xs text-gray-400">Your teams</div>
      </nav>

      {/* Profile */}
      <div className="p-4 flex items-center justify-between space-x-3 mb-8">
        <span className="flex-1 text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden font-semibold [font-size:23px]">{user?.name  || "Tom Cook"}</span>
        <div>
        <LogIn
          onClick={() => {
            dispatch(logout());
            router.push(`/login`); // 👈 optional redirect to login
          }}
          width={40} height={35} className="cursor-pointer" />
          </div>
      </div>

      {/* Modals */}
      {openProjectModel && (
        <CreateProjectModel open={openProjectModel} onOpenChange={setOpenProjectModel} />
      )}
      {openAddPeopleModal && (
        <AddPeopleModal
          open={openAddPeopleModal}
          onOpenChange={setOpenAddPeopleModal}
          project={selectedProject}
        />
      )}
    </div>
  );
};

const SidebarItem = ({
  icon,
  hover,
  text,
  route,
  count,
  active,
  onClick,
  onCountClick,
  dropdownOpen,
  project,
  onAddPeopleClick,
  onDeleteProjectClick,
  showMenu = true
}) => {
  const router = useRouter();
  const [menuOpenIdx, setMenuOpenIdx] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIdx(null);
      }
    };
    if (menuOpenIdx !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenIdx]);

  return (
    <div className={`group flex flex-col ${dropdownOpen ? 'bg-slate-800' : ''}`}>
      <div
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-700 ${active ? 'bg-slate-800 font-semibold' : ''}`}
        onClick={() => {
          if (route) {
            router.push(route);
          } else {
            onClick && onClick();
          }
        }}
      >
        <div className="flex items-center space-x-3">
          {text === "Projects" && (
            <>
              <span className="hidden group-hover:inline">
                {dropdownOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
              <Image src={roket} alt="roket" width={18} height={18} className="group-hover:hidden" />
            </>
          )}
          {text === "Teams" && <Users size={18} />}
          <span>{text}</span>
        </div>

        {count && (
          <span
            className="relative text-xs rounded-full px-2 py-2 transition-colors duration-200 bg-slate-600 hover:bg-[#0f172a] cursor-pointer group/count"
            onClick={e => {
              e.stopPropagation();
              onCountClick && onCountClick(e);
            }}
          >
            <span className="inline">{count}</span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/count:flex px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap z-10">
              {hover}
            </span>
          </span>
        )}
      </div>

      {/* Dropdown projects list */}
      {dropdownOpen && project && (
        <div className="ml-8 mt-1 flex flex-col gap-1">
          {project.map((item, idx) => (
            <div
              key={idx}
              className="px-2 py-1 rounded hover:bg-slate-700 cursor-pointer text-sm flex items-center justify-between relative"
            >
              <div
                className="flex items-center flex-1"
                onClick={() => {
                  const slug = item.name.toLowerCase().replace(/\s+/g, '-');
                  router.push(`/project/${slug}?id=${item._id}`);
                }}
              >
                <Folder height={12} />
                {item.name}
              </div>

              {/* 👇 Only show MoreHorizontal if showMenu is true */}
              {showMenu && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenIdx(menuOpenIdx === idx ? null : idx);
                  }}
                  className="inline ml-2 mr-1 cursor-pointer"
                >
                  <MoreHorizontal size={20} />
                </span>
              )}

              {showMenu && menuOpenIdx === idx && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-7 z-50 bg-white text-black border rounded shadow-md w-36"
                >
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setMenuOpenIdx(null);
                      onAddPeopleClick && onAddPeopleClick(item);
                    }}
                  >
                    <UserPlus width={17} height={17} className="mr-1" />
                    <div className="mt-1">Add people</div>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => {
                      setMenuOpenIdx(null);
                      onDeleteProjectClick && onDeleteProjectClick(item._id);
                    }}
                  >
                    <Trash2 width={17} height={17} className="mr-1 text-red-700" />
                    <div className="mt-1 text-red-700">Delete project</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
