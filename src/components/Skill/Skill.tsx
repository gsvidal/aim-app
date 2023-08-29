import { UserDashDataObj } from "../../api/adapter";
import { Button } from "../Button/Button";
import "./Skill.scss";
import reactionTimeUrl from "/assets/reaction-time.svg";
import aimUrl from "/assets/aim.svg";

type SkillProps = {
  userDataItem: UserDashDataObj;
};

type SkillImagesUrlObj = {
  [key: string]: string; // Index signature to support dynamic keys of type string
};

const skillImagesUrl: SkillImagesUrlObj = {
  "reaction-time": reactionTimeUrl,
  aim: aimUrl,
};

type SkillNameObj = {
  [key: string]: string;
}

const skillNameDict: SkillNameObj = {
  "reaction-time": "Reaction Time",
  aim: "Aim"
}

export const Skill: React.FC<SkillProps> = ({ userDataItem }) => {
  const { lastScore, bestScore, avgScore, skillName } = userDataItem;

  const formattedLastScore = lastScore.toFixed(1) + "ms";
  const formattedBestScore = bestScore.toFixed(1) + "ms";
  const formattedAvgScore = avgScore.toFixed(1) + "ms";

  return (
    <>
      <article className="score">
        <h2 className="score__title">{skillNameDict[skillName]}</h2>
        <figure className="score__image-container">
          <img
            className="score__image"
            src={skillImagesUrl[skillName]}
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
