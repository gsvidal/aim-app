import { useEffect, useState } from "react";

import { UserDataResponseObj, fetchUserData } from "../../api/adapter";

import { Skill } from "../Skill/Skill";
import { Loader } from "../Loader/Loader";

import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

type DashboardProps = {
  token: string;
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (value: boolean) => void;
};

export const Dashboard: React.FC<DashboardProps> = ({
  token,
  isUserLoggedIn,
  setIsUserLoggedIn,
}) => {
  const [userDashData, setUserDashData] = useState<UserDataResponseObj>({
    username: "",
    userData: [],
    skillsData: [],
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userDashData) {
      setIsLoading(false);
    }
  }, [userDashData]);

  useEffect(() => {
    // console.log("dashboard token send to /:", token);
    setIsLoading(true);

    async function fetchData() {
      const data = await fetchUserData(token);
      if (data) {
        setUserDashData(data);
        setIsLoading(false);
      } else {
        console.log("user not logged and is going to login");
        setIsUserLoggedIn(false);
      }
    }

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/");
    }
  }, [isUserLoggedIn]);

  if (isLoading) {
    return <Loader />;
  }

  const { username, userData, skillsData } = userDashData || {};

  return (
    <>
      <h1>Welcome {username}!</h1>
      {userData.length === 0 && (
        <h2>You haven't played any games yet, try one!</h2>
      )}
      <section className="skill__list">
        {skillsData.map((skillItem) => (
          <Skill key={skillItem.id} skillItem={skillItem} userData={userData} />
        ))}
      </section>
    </>
  );
};
