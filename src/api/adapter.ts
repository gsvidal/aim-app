import { ErrorPage } from "../components/ErrorPage/ErrorPage";

const apiUrl = import.meta.env.VITE_API_URL; // Make sure to use the correct environment variable

export interface AppDataResponseObj {
  username: string;
  userData: UserDashDataObj[];
  skillsData: SkillsDataObj[];
}

// export type AppErrorResponseObj = {
//   message: string;
// }

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
  const frontendUserData = backendData.user_dash_data.map((userDataItem) => ({
    username: userDataItem["user_name"],
    skillId: userDataItem["skill_id"],
    skillName: userDataItem["skill_name"],
    avgScore: userDataItem["avg_score"],
    bestScore: userDataItem["best_score"],
    lastScore: userDataItem["last_score"],
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
    console.log("fetch");
    const response = await fetch(`${apiUrl}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const backendData = await response.json();
      //   console.log(backendData);
      const frontendData = mapBackendToResponse(backendData);
      //   console.log(frontendData);
      return frontendData;
    } else {
      const errorResponse = await response.json();
      // console.log(errorResponse.msg);
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
    const response = await fetch(`${apiUrl}/reaction-time`, {
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
      console.log(data);
      console.log(data.value);
      return data;
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
