
const apiUrl = import.meta.env.VITE_API_URL; // Make sure to use the correct environment variable

export interface UserDataResponseObj {
  username: string;
  userData: UserDashDataObj[];
}

export type UserDashDataObj = {
    username: string;
    skillId: string;
    skillName: string;
    avgScore: number;
    bestScore: number;
    lastScore: number;
  };

interface BackendUserDataResponse {
  user_name: string;
  user_dash_data: BackendUserDashDataObj[];
}

export type BackendUserDashDataObj = {
    user_name: string;
    skill_id: string;
    skill_name: string;
    avg_score: number;
    best_score: number;
    last_score: number;
  };

// Map backend response to frontend response
function mapBackendToResponse(backendData: BackendUserDataResponse): UserDataResponseObj {
    const frontendUserData = backendData.user_dash_data.map(userDataItem => ({
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
    };
  }

export async function fetchUserData(token: string): Promise<UserDataResponseObj | null> {
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
      console.error("Failed to fetch data from the server");
      return null;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    return null;
  }
}