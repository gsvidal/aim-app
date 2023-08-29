import { UserDashDataObj } from "../../api/adapter";
import { Button } from "../Button/Button";
import "./Skill.scss";

type SkillProps = {
  userDataItem: UserDashDataObj;
};

export const Skill: React.FC<SkillProps> = ({ userDataItem }) => {
  const { lastScore, bestScore, avgScore } = userDataItem;

  const formattedLastScore = lastScore.toFixed(1) + "ms";
  const formattedBestScore = bestScore.toFixed(1) + "ms";
  const formattedAvgScore = avgScore.toFixed(1) + "ms";
  return (
    <>
      {/* TODO: make a component Skill */}
      <article className="score">
        <figure className="score__image-container">
          <img
            className="score__image"
            src=""
            alt="Skill"
            width="100"
            height="100"
          />
        </figure>

        <p>Scores:</p>

        <ul className="score__list">
          <li className="score__item">
            Last: <span>{formattedLastScore}</span>
          </li>
          <li className="score__item">
            Best: <span>{formattedBestScore}</span>
          </li>
          <li className="score__item">
            Average: <span>{formattedAvgScore}</span>
          </li>
        </ul>
        <Button type="play">Play</Button>
      </article>
    </>
  );
};
