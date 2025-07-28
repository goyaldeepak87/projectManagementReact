import axios from "axios";
import { DefaultHeader } from "./DefaultHeader";
import { API_BASE_URL } from "@/config/appBaseUrl";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create a new Projects
export const createProject = async (sessionData) => {
  console.log("sadasdada", sessionData)
  try {
    const res = await axios.post(`${API_BASE_URL}/users/project`, sessionData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

// get All Projects
export const getAllMyProject = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/project/my`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};

// get My Projects All Teams
export const getMyProjectAllTeams = async () => {
  console.log("Fetching all teams for the project");
  try {
    const res = await axios.get(`${API_BASE_URL}/users/project/myallteams`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};

// Create a new Member
export const createMember = async (sessionData) => {
  console.log("sadasdada", sessionData)
  try {
    const res = await axios.post(`${API_BASE_URL}/users/createmember`, sessionData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};

// /projects/:projectId/tasks
// Create a new Projects
export const createTaskAPI = async (sessionData) => {
  console.log("sadasdada", sessionData)
  try {
    const res = await axios.post(`${API_BASE_URL}/users/projects/createtask`, sessionData, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data.data.result;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw error;
  }
};


export const getProjectTaskAPI = async (projectId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/projects/${projectId}/tasks`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};


// Move task to another column
export const moveTaskToColumn = async (taskId, newStatus) => {
  try {
    const res = await axios.patch(`${API_BASE_URL}/users/tasks/${taskId}/move`, { newStatus: newStatus }, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};


// project tasks get by members /tasks/:projectId/members
export const getProjectMembers = async (projectId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/tasks/${projectId}/members`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};


//project tasks get by members assign /tasks/:taskId/assign'
export const assignTask = async (projectTaskID, assignedId) => {
  console.log("Assigning task", projectTaskID, assignedId);
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
    console.log("Error fetching meetings:", error);
    throw error;
  }
};


//project tasks get by members assign /tasks/:taskId/assign'
export const deleteCreateProject = async (projectId) => {
  console.log("Deleting project", projectId);
  try {
    const res = await axios.delete(`${API_BASE_URL}/users/projects/${projectId}`, {
      headers: {
        ...await DefaultHeader(),
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data.data.result;
  } catch (error) {
    console.log("Error fetching meetings:", error);
    throw error;
  }
};


// /project-invite/verify
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
    console.log("Error fetching meetings:", error);
    throw error;
  }
};

// Meeting related API calls
// export const getMeetings = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/user/api/meetings`, {
//       headers: {
//         ...await DefaultHeader(),
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     return res.data;
//   } catch (error) {
//     console.log("Error fetching meetings:", error);
//     throw error;
//   }
// };


// export const getMyBookedMeetings = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/user/api/my-booked-meetings`, {
//       headers: {
//         ...await DefaultHeader(),
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     return res.data?.data?.bookedMeetings || [];
//   } catch (error) {
//     console.log("Error fetching booked meetings:", error);
//     throw error;
//   }
// };


// // Get host's created sessions
// export const getHostSessions = async () => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/user/api/host/my_sessions`, {
//       headers: {
//         ...await DefaultHeader(),
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     return res.data?.data?.meetings || [];
//   } catch (error) {
//     console.error("Failed to fetch host sessions:", error);
//     throw error;
//   }
// };

// Create a new session
