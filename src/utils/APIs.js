import axios from "axios";
import { DefaultHeader } from "./DefaultHeader";
import { API_BASE_URL } from "@/config/appBaseUrl";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ==============================
//   Project APIs
// ==============================

// Create a new project
export const createProject = async (projectData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/projects`, projectData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to create project:", error);
    throw error;
  }
};


// Get all projects created by the logged-in user
export const getAllMyProjects = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/projects/my`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Get all teams from the user's projects
export const getMyProjectAllTeams = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/projects/my/teams`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};


// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/users/projects/${projectId}`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
};

// ==============================
//  Member APIs
// ==============================

// Add a member to a project
export const createMember = async (memberData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/projects/members`, memberData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to add member:", error);
    throw error;
  }
};

// Get members of a specific project
export const getProjectMembers = async (projectId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/projects/${projectId}/members`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
};

// ==============================
//  Task APIs
// ==============================

// Create a task in a project
export const createTaskAPI = async (taskData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/projects/createtask`, taskData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
};


// Get all tasks for a specific project
export const getProjectTaskAPI = async (projectId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/users/projects/${projectId}/tasks`,
      {
        headers: {
          ...await DefaultHeader(),
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data.data.result;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw error;
  }
};


// Move task to a new column (e.g., from todo → in-progress)
export const moveTaskToColumn = async (taskId, newStatus) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/users/tasks/${taskId}/move`,
      { newStatus },
      {
        headers: {
          ...await DefaultHeader(),
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data.data.result;
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};

// Assign a task to a specific member
export const assignTask = async (projectTaskID, assignedId) => {
  let taskId = projectTaskID;
  let assignedTo = assignedId;
  try {
    const res = await axios.patch(`${API_BASE_URL}/users/tasks/${taskId}/assign`, { assignedTo: assignedTo }, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
     console.error("Error assigning task:", error);
    throw error;
  }
};


// ==============================
//  Project Invite Verification
// ==============================

// Verify project invitation token
export const getVerifyProject = async ({token}) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/project-invite/verify`, { token}, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
      console.error("Error verifying project invite:", error);
    throw error;
  }
};