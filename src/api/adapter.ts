import { ErrorPage } from "../components/ErrorPage/ErrorPage";

const apiUrl = import.meta.env.VITE_API_URL; // Make sure to use the correct environment variable

export interface AppDataResponseObj {
  username: string;
  userData: UserDashDataObj[];
  skillsData: SkillsDataObj[];
}

export type UserDashDataObj = {
  username: string;
  skillId: number;
  skillName: string;
  avgScore: number;
  bestScore: number;
  lastScore: number;
};

export type SkillsDataObj = {
  id: number;
  code: string;
  name: string;
};

interface BackendUserDataResponse {
  user_name: string;
  user_dash_data: BackendUserDashDataObj[];
  skills_data: SkillsDataObj[];
}

export type BackendUserDashDataObj = {
  user_name: string;
  skill_id: number;
  skill_name: string;
  avg_score: number;
  best_score: number;
  last_score: number;
};

// Map backend response to frontend response
function mapBackendToResponse(
  backendData: BackendUserDataResponse
): AppDataResponseObj {
  const frontendUserData = backendData.user_dash_data.map((userData) => ({
    username: userData["user_name"],
    skillId: userData["skill_id"],
    skillName: userData["skill_name"],
    avgScore: userData["avg_score"],
    bestScore: userData["best_score"],
    lastScore: userData["last_score"],
  }));

  return {
    username: backendData.user_name,
    userData: frontendUserData,
    skillsData: backendData.skills_data,
  };
}

export const fetchUserData = async (
  token: string
): Promise<AppDataResponseObj | null> => {
  try {
    const response = await fetch(`${apiUrl}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const backendData = await response.json();
      const frontendData = mapBackendToResponse(backendData);
      return frontendData;
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse.msg);
      return null;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return null;
  }
};

type GameDataResponseObj = {
  code: number;
  message: string;
};

type dataBodyObj = {
  skill: string;
  score: number;
  token: string;
};

// Post reaction time game data
export const sendGameData = async (
  dataBody: dataBodyObj
): Promise<GameDataResponseObj | null> => {
  try {
    const response = await fetch(`${apiUrl}/games`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dataBody.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skill_code: dataBody.skill,
        score: dataBody.score,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse);
      return null;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return null;
  }
};

// Get Positions

type BackendUserDataObj = {
  user_id: number;
  user_name: string;
  reaction_time: number;
  aim: number;
  total: number; 
};

type BackendAllUsersDataObj = {
  users_data: BackendUserDataObj[];
};

export type UserResponseObj = {
  userId: number;
  username: string;
  reactionTime: number;
  aim: number;
  total: number;
};

type AllUsersResponseObj = {
  usersData: UserResponseObj[];
};

// Map backend response to frontend response
function mapBacktoFront(
  backendData: BackendAllUsersDataObj
): AllUsersResponseObj {
  const frontendUserData = backendData.users_data.map((userData) => ({
    userId: userData["user_id"],
    username: userData["user_name"],
    reactionTime: userData["reaction_time"],
    aim: userData["aim"],
    total: userData["total"],
  }));

  return {
    usersData: frontendUserData,
  };
}

export const fetchAllUsersData = async (
  token: string
): Promise<AllUsersResponseObj | null> => {
  try {
    const response = await fetch(`${apiUrl}/positions`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const backendData = await response.json();
      const frontendData = mapBacktoFront(backendData);
      return frontendData;
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse.msg);
      return null;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return null;
  }
};
