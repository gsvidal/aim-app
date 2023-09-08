import { useState, useEffect } from "react";
import { UserResponseObj } from "../../api/adapter";
import "./PositionItem.scss";

type PositionItemProps = {
  userData: UserResponseObj;
  id: number;
  loggedUsername: string;
};

export const PositionItem: React.FC<PositionItemProps> = ({
  userData,
  id,
  loggedUsername,
}) => {
  const { username, reactionTime, aim, total } = userData;
  const [isOwnUser, setIsOwnUser] = useState<boolean>(false);

  useEffect(() => {
    if (loggedUsername === username) {
      setIsOwnUser(true);
    }
  }, []);

  return (
    <tr className={`positions-data-row ${isOwnUser ? "activate" : ""}`}>
      <td className="positions-data positions-data--name">{username}</td>
      <td className="positions-data positions-data--rt">{reactionTime}</td>
      <td className="positions-data positions-data--aim">{aim}</td>
      <td className="positions-data positions-data--total">{total}</td>
      <td className="positions-data positions-data--ranking">
        {total ? (
          <>
            <span>{id + 1}</span>
            {id + 1 === 1 && <span className="icon icon--first"></span>}
          </>
        ) : (
          <>
            <span className="rank">
              No rank <span className="icon icon--info"></span>
              <span className="tooltip">
                You must play all the games to unlock your rank
              </span>
            </span>
          </>
        )}
      </td>
    </tr>
  );
};
