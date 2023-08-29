import { useEffect, useState } from "react";
import "./Dashboard.scss";
import { Loader } from "../Loader/Loader";
import { Skill } from "../Skill/Skill";
import { UserDataResponseObj, fetchUserData } from "../../api/adapter";

type DashboardProps = {
  token: string;
};

export const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [userDashData, setUserDashData] = useState<UserDataResponseObj>({
    username: "",
    userData: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userDashData) {
      setIsLoading(false);
    }
  }, [userDashData]);

  useEffect(() => {
    console.log("token dashboard to send to /:", token);
    setIsLoading(true);

    async function fetchData() {
      const data = await fetchUserData(token);
      if (data) {
        setUserDashData(data);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (isLoading) {
    return <Loader />;
  }

  const { username, userData } = userDashData || {};

  return (
    <>
      <h1>Welcome {username}!</h1>
      <section className="skill__list">
        {userData.map((userDataItem) => (
          <Skill key={userDataItem["skillId"]} userDataItem={userDataItem} />
        ))}
      </section>
    </>
  );
};
