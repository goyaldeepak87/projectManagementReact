import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  MoreHorizontal,
  CornerUpRight,
  Check,
  X,
  Edit,
  ChevronRight,
} from "react-feather";
import ProjectItemHeader from "./ProjectItemHeader";
import { assignTask, createTaskAPI, getProjectMembers, getProjectTaskAPI, moveTaskToColumn } from "@/utils/APIs";
import { toast } from "react-toastify";

const ProjectManage = () => {
  const router = useParams()
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const [columns, setColumns] = useState([]);
  const [showInputIndex, setShowInputIndex] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [addingColumn, setAddingColumn] = useState(false);
  const [dropdown, setDropdown] = useState({ type: null, columnIndex: null, taskIndex: null });
  const [assigneeInput, setAssigneeInput] = useState("");
  const [editingTask, setEditingTask] = useState({ columnIndex: null, taskIndex: null, text: "" });
  const [projectMember, setProjectMember] = useState([]);

  // For dropdown/menu outside click
  const menuRef = useRef(null);

  useEffect(() => {
    let timeoutId;
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setDropdown({ type: null, columnIndex: null, taskIndex: null });
        setEditingTask({ columnIndex: null, taskIndex: null, text: "" });
      }
    };
    if (dropdown.type !== null || editingTask.columnIndex !== null) {
      timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 1000);
    }
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown, editingTask]);

  const assigneeOptions = [
    { name: "Unassigned", email: "", initials: "UA" },
    { name: "Automatic", email: "automatic@system.com", initials: "A" },
    {
      name: "Deepak goyal (Assign to me)",
      email: "goyaldeepak871@gmail.com",
      initials: "DG",
    },
  ];

  const handleAddCard = async (index) => {
    if (!newTask.trim()) return;
    const status = columns[index].title.toLowerCase().split(' ')
      .map(word => word?.charAt(0)?.toLowerCase() + word.slice(1))
      .join('');
    const taskData = {
      description: newTask.trim(),
      // assignedTo: "DG",
      status: status,
      projectId: projectId,
    };

    const createdTask = await createTaskAPI(taskData);
    toast.success('Task created successfully!');
    // if()
    if (createdTask) {
      const updated = [...columns];
      updated[index].tasks.push({
        ...createdTask,
        text: createdTask.description, // 👈 map 'description' to 'text' for UI
      });
      setColumns(updated);
      setNewTask("");
      setShowInputIndex(null);
    }
  };


  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn = {
      id: Date.now(),
      title: newColumnTitle.trim(),
      tasks: [],
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setAddingColumn(false);
  };


  const handleAssign = async (colIdx, taskIdx, assignedTo, projectTaskID, assignedId) => {

    try {
      // Make API call to assign task first
      await assignTask(projectTaskID, assignedId?._id);
      // If successful, update UI
      const updated = [...columns];
      updated[colIdx].tasks[taskIdx].assignedTo = { name: assignedId.name, email: assignedId.email };
      setColumns(updated);

      // Reset UI state
      setDropdown({ type: null, columnIndex: null, taskIndex: null });
      setAssigneeInput("");
    } catch (error) {
      console.error("Error assigning task:", error);
      // Optional: show user feedback
      toast?.error("Failed to assign task. Please try again.");
    }
  };


  const formatTasksToColumns = (tasks) => {
    const defaultColumns = {
      todo: { id: "todo", title: "TO DO", tasks: [] },
      inProgress: { id: "inProgress", title: "IN PROGRESS", tasks: [] },
      done: { id: "done", title: "DONE", tasks: [] },
    };

    const statusKeyMap = {
      todo: "todo",
      inprogress: "inProgress",
      done: "done"
    };

    tasks.forEach((task) => {
      const statusKey = statusKeyMap[task.status?.toLowerCase()] || "todo";
      if (!defaultColumns[statusKey]) return;
      defaultColumns[statusKey].tasks.push({
        id: task._id,
        text: task.description,
        order: task.order,
        createdAt: task.createdAt,
        createdBy: task.createdBy,
        assignedTo: task.assignedUser || { name: "Unassigned", email: "" },
      });
    });

    Object.values(defaultColumns).forEach((col) =>
      col.tasks.sort((a, b) => a.order - b.order)
    );

    return Object.values(defaultColumns);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProjectTaskAPI(projectId); // your API call
      if(result.status !== 201) {
        toast.error("Failed to fetch project tasks"); 
        return;
      }
      const res = result.data.data.result;
      const formatted = formatTasksToColumns(res);
      setColumns(formatted);
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProjectMembers(projectId); // your API call
      setProjectMember(res);
    };

    fetchData();
  }, [projectId]);


  const [hoveredMove, setHoveredMove] = useState(false);
  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <ProjectItemHeader />
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search board"
          className="border border-gray-300 px-4 py-2 rounded-md w-64"
        />

        <div className="flex items-center gap-2">
          {projectMember?.map((user, i) => (
            <div key={user?._id}>
              <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">{user?.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 pb-4">
        {columns.map((column, index) => (
          <div key={column.id} className="min-w-[300px] max-w-[300px] bg-gray-100 rounded-md p-1">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-3 p-3">
              <h2 className="font-semibold text-gray-700 uppercase">{column.title}</h2>
              <button className="text-gray-700 hover:bg-gray-300 p-1 rounded-full cursor-pointer">
                <MoreHorizontal />
              </button>
            </div>

            {/* Tasks */}
            {column.tasks.map((task, i) => {
              const isEditing = editingTask.columnIndex === index && editingTask.taskIndex === i;

              return (
                <div key={i} className="relative bg-white rounded shadow-sm p-3 mb-2 text-sm">
                  {isEditing ? (
                    <div
                      className="bg-white border border-blue-500 rounded-md p-3 shadow-sm mb-3"
                      ref={menuRef}
                    >
                      <textarea
                        autoFocus
                        className="outline-none border-none bg-transparent text-sm w-full h-16 resize-none"
                        value={editingTask.text}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, text: e.target.value })
                        }
                        onBlur={() => {
                          const updated = [...columns];
                          updated[index].tasks[i].text =
                            editingTask.text.trim() || columns[index].tasks[i].text;
                          setColumns(updated);
                          setEditingTask({ columnIndex: null, taskIndex: null, text: "" });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const updated = [...columns];
                            updated[index].tasks[i].text =
                              editingTask.text.trim() || columns[index].tasks[i].text;
                            setColumns(updated);
                            setEditingTask({ columnIndex: null, taskIndex: null, text: "" });
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex" onMouseLeave={() => setHoveredMove(false)}>
                      <div className="flex-1 break-words break-all pr-2">
                        {task.text}
                        <span
                          onClick={e => {
                            setEditingTask({ columnIndex: index, taskIndex: i, text: task.text });
                          }}
                          className="relative text-gray-400 cursor-pointer hover:text-blue-600"
                          title="Edit task"
                        >
                          <Edit width={15} height={15} className="absolute top-0 -right-[19px]" />
                        </span>
                      </div>

                      {/* Task Menu */}
                      <div>
                        <div className="relative inline-block">
                          <div
                            className="cursor-pointer"
                            onClick={e => {
                              const isOpen =
                                dropdown.type === "taskMenu" &&
                                dropdown.columnIndex === index &&
                                dropdown.taskIndex === i;
                              setDropdown(
                                isOpen
                                  ? { type: null, columnIndex: null, taskIndex: null }
                                  : { type: "taskMenu", columnIndex: index, taskIndex: i }
                              );
                            }}
                          >
                            <MoreHorizontal height={20} color="gray" />
                          </div>

                          {dropdown.type === "taskMenu" &&
                            dropdown.columnIndex === index &&
                            dropdown.taskIndex === i && (
                              <div
                                className="absolute right-0 top-6 z-50 bg-white border rounded w-[170px] shadow-[1px_2px_6px_#808080d1] border-0"
                                ref={menuRef}
                              >
                                <div
                                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    const updated = [...columns];
                                    updated[index].tasks.splice(i, 1);
                                    setColumns(updated);
                                    setDropdown({ type: null, columnIndex: null, taskIndex: null });
                                  }}
                                >
                                  Delete
                                </div>
                                <div
                                  className="relative"
                                  onMouseEnter={() => setHoveredMove(true)}
                                // onMouseLeave={() => setHoveredMove(false)}
                                >
                                  <div
                                    className="px-3 flex justify-between items-center py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      setDropdown({ type: null, columnIndex: null, taskIndex: null });
                                    }}
                                  >
                                    Move <ChevronRight width={17} />
                                  </div>
                                  {hoveredMove && (
                                    <div className="absolute left-full top-0 mt-0 bg-white border rounded shadow z-50 w-[170px] shadow-[1px_2px_6px_#808080d1] border-0 pl-[3px] -ml-[2px]">
                                      {columns.map((col, moveIndex) => {
                                        if (moveIndex === index) return null; // 👈 skip current column

                                        return (
                                          <div
                                            key={col.id}
                                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={async () => {
                                              const taskToMove = columns[index].tasks[i];
                                              const targetStatus = columns[moveIndex].title
                                                .toLowerCase()
                                                .replace(/\s+/g, '');

                                              try {
                                                await moveTaskToColumn(taskToMove.id, targetStatus);

                                                const updated = [...columns];
                                                updated[index].tasks.splice(i, 1);
                                                updated[moveIndex].tasks.push(taskToMove);
                                                setColumns(updated);
                                                setDropdown({ type: null, columnIndex: null, taskIndex: null });
                                                setHoveredMove(false);
                                              } catch (err) {
                                                alert("Failed to move task");
                                              }
                                            }}

                                          >
                                            {col.title}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                </div>
                              </div>
                            )}
                        </div>

                        {/* Assignee */}
                        <div className="flex justify-end relative mt-2 h-[calc(100%-36px)] items-end">
                          <div
                            className="w-6 h-6 text-[9px] font-bold cursor-pointer bg-cyan-600 text-white rounded-full flex items-center justify-center"
                            onClick={e => {
                              const isOpen =
                                dropdown.type === "assignee" &&
                                dropdown.columnIndex === index &&
                                dropdown.taskIndex === i;
                              setDropdown(
                                isOpen
                                  ? { type: null, columnIndex: null, taskIndex: null }
                                  : { type: "assignee", columnIndex: index, taskIndex: i }
                              );
                            }}
                          >
                            {task?.assignedTo?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>

                          {dropdown.type === "assignee" &&
                            dropdown.columnIndex === index &&
                            dropdown.taskIndex === i && (
                              <div
                                className="absolute bottom-[-0%] right-0 bg-white border rounded shadow-md p-2 z-50 w-64"
                                ref={menuRef}
                              >
                                <input
                                  type="text"
                                  placeholder="Search assignee"
                                  value={assigneeInput}
                                  onChange={(e) => setAssigneeInput(e.target.value)}
                                  className="w-full px-3 py-1 border rounded mb-2 text-sm"
                                />
                                <ul className="space-y-1 max-h-40 overflow-auto">
                                  {projectMember
                                    ?.filter((user) =>
                                      user?.userId?.name
                                        ?.toLowerCase()
                                        ?.includes(assigneeInput.toLowerCase())
                                    )
                                    ?.map((user, idx) => (
                                      <li
                                        key={idx}
                                        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                                        onClick={() => {
                                          handleAssign(index, i, user.initials, task.id, user?.userId, user?.userId?._id || user?.userId?.name, user?.userId, user?.userId?._id)
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                            {user.initials}
                                            {user?.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-800">
                                              {user?.userId?.name} {user?.userId?.role == "admin" ? `(${user?.userId?.role})` : ""}
                                            </div>
                                            {user.email && (
                                              <div className="text-xs text-gray-500">
                                                {user?.userId?.email}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Input Textarea */}
            {showInputIndex === index && (
              <div className="bg-white border border-blue-500 rounded-md p-3 shadow-sm mb-3">
                <textarea
                  autoFocus
                  placeholder="What needs to be done?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard(index);
                    }
                  }}
                  className="outline-none border-none bg-transparent text-sm w-full h-16 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleAddCard(index)}
                    className="rotate-180 text-gray-500 hover:text-blue-600"
                  >
                    <CornerUpRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Create Task Button */}
            <div
              className="flex items-center text-gray-700 hover:bg-gray-300 cursor-pointer px-3 py-2"
              onClick={() => setShowInputIndex(index)}
            >
              <Plus size={16} className="mr-1" />
              Create
            </div>
          </div>
        ))}

        {/* Add Column */}
        {addingColumn ? (
          <div className="min-w-[300px] max-h-[64px] bg-gray-100 rounded-md p-3 shadow-md">
            <input
              type="text"
              placeholder="Enter column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
              }}
              maxLength={30}
              className="text-sm p-3 w-full h-10 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <div className="flex justify-end mt-4">
              <div
                className="shadow mr-2 cursor-pointer w-[25px] h-[25px] flex items-center justify-center border-2 border-dashed rounded-md text-gray-500 hover:bg-gray-50"
                onClick={() => setAddingColumn(false)}
              >
                <X />
              </div>
              <div
                className="shadow cursor-pointer w-[25px] h-[25px] flex items-center justify-center border-2 border-dashed rounded-md text-gray-500 hover:bg-gray-50"
                onClick={handleAddColumn}
              >
                <Check />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingColumn(true)}
            className="cursor-pointer min-w-[30px] h-[30px] flex items-center justify-center border-2 border-dashed rounded-md text-gray-500 hover:bg-gray-50"
          >
            <Plus size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectManage;