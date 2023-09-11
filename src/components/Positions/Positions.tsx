import { useState, useEffect } from "react";
import { UserResponseObj, fetchAllUsersData } from "../../api/adapter";
import { PositionItem } from "../PositionItem/PositionItem";
import "./Positions.scss";

type PositionsProps = {
  token: string;
  username: string;
};

export const Positions: React.FC<PositionsProps> = ({ token, username }) => {
  const [usersData, setUsersData] = useState<UserResponseObj[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllUsersData(token);
      if (data) {
        setUsersData(data.usersData);
      }
    };
    fetchData();
  }, []);

  const rankedUsers = usersData.filter((userData) => userData.total !== null);
  const unrankedUsers = usersData.filter((userData) => userData.total === null);

  rankedUsers.sort((a, b) => b.total - a.total); // In case data from backend doesn't come desc ordered

  const sortedUsersData = rankedUsers.concat(unrankedUsers);

  return (
    <section className="glass-container">
      <h1>General Ranking</h1>
      <div className="game__arena game__arena--positions">
        <table className="positions__table">
          <thead>
            <tr>
              <th className="positions-head positions-head--name">Name</th>
              <th>
                Reaction Time {"("}ms{")"}
              </th>
              <th>
                Aim {"("}ms{")"}
              </th>
              <th>Total</th>
              <th className="positions-head positions-head--ranking">
                Ranking
              </th>
            </tr>
          </thead>
          <tbody>
            {usersData.length !== 0 ? (
              sortedUsersData.map((userData, index) => (
                <PositionItem
                  id={index}
                  key={userData.userId}
                  userData={userData}
                  loggedUsername={username}
                />
              ))
            ) : (
              <tr>
                <td className="data-loading" colSpan={5}>Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
