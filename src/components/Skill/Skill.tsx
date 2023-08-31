import { SkillsDataObj, UserDashDataObj } from "../../api/adapter";

import { Button } from "../Button/Button";

import reactionTimeUrl from "/assets/reaction-time.svg";
import aimUrl from "/assets/aim.svg";
import "./Skill.scss";
import { Link } from "react-router-dom";

type SkillProps = {
  skillItem: SkillsDataObj;
  userData: UserDashDataObj[];
};

type SkillImagesUrlObj = {
  [key: string]: string; // Index signature to support dynamic keys of type string
};

const skillImagesUrl: SkillImagesUrlObj = {
  "reaction-time": reactionTimeUrl,
  aim: aimUrl,
};

export const Skill: React.FC<SkillProps> = ({ skillItem, userData }) => {
  const { name, code, id } = skillItem;

  const currentData = userData.find((item) => item.skillId === id);

  let formattedLastScore = "N/A";
  let formattedBestScore = "N/A";
  let formattedAvgScore = "N/A";

  if (currentData) {
    formattedLastScore = `${currentData.lastScore.toFixed(1)}ms`;
    formattedBestScore = `${currentData.bestScore.toFixed(1)}ms`;
    formattedAvgScore = `${currentData.avgScore.toFixed(1)}ms`;
  }

  return (
    <>
      <article className="score glass-container">
        <h2 className="score__title">{name}</h2>
        <figure className="score__image-container">
          <img
            className="score__image"
            src={skillImagesUrl[code]}
            alt="Skill"
            width="100"
            height="100"
          />
        </figure>

        <p className="score__subtitle">Scores:</p>
        <ul className="score__list">
          <li className="score__item">
            Last : <span>{formattedLastScore}</span>
          </li>
          <li className="score__item">
            Best : <span>{formattedBestScore}</span>
          </li>
          <li className="score__item">
            Average : <span>{formattedAvgScore}</span>
          </li>
        </ul>

        <Link to={`/${code}`}>
          <Button type="game"> Play</Button>
        </Link>
      </article>
    </>
  );
};
