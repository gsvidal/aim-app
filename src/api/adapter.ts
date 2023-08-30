const apiUrl = import.meta.env.VITE_API_URL; // Make sure to use the correct environment variable

export interface UserDataResponseObj {
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
): UserDataResponseObj {
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

export async function fetchUserData(
  token: string
): Promise<UserDataResponseObj | null> {
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
    //   console.log(backendData);
      const frontendData = mapBackendToResponse(backendData);
    //   console.log(frontendData);
      return frontendData;
    } else {
      console.log(response)
      console.error("Failed to fetch data from the server");
      return null;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return null;
  }
}
