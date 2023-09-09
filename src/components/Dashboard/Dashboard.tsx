import { useEffect, useState } from "react";

import { AppDataResponseObj, fetchUserData } from "../../api/adapter";

import { Skill } from "../Skill/Skill";
import { Loader } from "../Loader/Loader";

import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

type DashboardProps = {
  isUserLoggedIn: boolean;
  userTheme: string;
  token: string
};

export const Dashboard: React.FC<DashboardProps> = ({
  isUserLoggedIn,
  userTheme,
  token
}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appData, setAppData] = useState<AppDataResponseObj>({username: "", userData: [], skillsData: []});

  useEffect(() => {
    const  fetchData = async () => {
      const data = await fetchUserData(token);
      if (data) {
        setAppData(data);
      } 
    }
    fetchData();
  }, [isUserLoggedIn, token])

  useEffect(() => {
    if (appData) {
      setIsLoading(false);
    }
  }, [appData]);

  const { username, userData, skillsData } = appData;

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/");
    }
  }, [isUserLoggedIn]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <h1>Welcome {username}!</h1>
      {userData.length === 0 && (
        <h2>You haven't played any games yet, try one!</h2>
      )}
      <section className="skill__list">
        {skillsData.map((skillItem) => (
          <Skill
            key={skillItem.id}
            skillItem={skillItem}
            userData={userData}
            userTheme={userTheme}
          />
        ))}
      </section>
    </>
  );
};
