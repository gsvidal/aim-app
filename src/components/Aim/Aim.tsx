import { useEffect, useState, useRef } from "react";
import "./Aim.scss";
import { Target } from "../Target/Target";
import { Button } from "../Button/Button";
import { sendGameData } from "../../api/adapter";

type AimProps = {
  token: string;
};

type targetObj = {
  id: number;
  isVisible: boolean;
  times: DOMHighResTimeStamp[];
};

const MAX_TARGET_SIZE: number = 3;
const TARGET_TIME: number = 2000;

export const Aim: React.FC<AimProps> = ({ token }) => {
  const initialTargets: targetObj[] = Array.from(
    { length: MAX_TARGET_SIZE },
    (_, index) => ({
      id: index,
      isVisible: false,
      times: [],
    })
  );

  const initialScores: number[] = Array.from(
    { length: MAX_TARGET_SIZE },
    () => TARGET_TIME
  );

  const [targets, setTargets] = useState<targetObj[]>(initialTargets);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [hasGameFinished, setHasGameFinished] = useState(false);
  const hasGameFinishedBeenTrue = useRef(false);

  const [scores, setScores] = useState<number[]>(initialScores);
  const [saveStatusMsg, setSaveStatusMsg] = useState({
    success: "",
    error: "",
  });

  const randomPositions = () => {
    const top = Math.round(200 * Math.random());
    const left = Math.round(80 * Math.random());
    const results = { top: `${top}px`, left: `${left}%` };
    return results;
  };

  const calculateTotalScore = (array: number[]) => {
    const averageScore =
      array.reduce((a: number, b: number) => a + b, 0) / array.length;
    return averageScore;
  };

  const handleReset = () => {
    console.log("reset")
    setTargets(initialTargets);
    setScores(initialScores);
    setCurrentTargetIndex(0);
    setHasGameFinished(false);
    setHasGameStarted(false);

  };

  useEffect(() => {
    if (currentTargetIndex === MAX_TARGET_SIZE) {
      setHasGameStarted(false);
      setHasGameFinished(true);
    }
  }, [scores, currentTargetIndex]);

  useEffect(() => {
    if (hasGameFinished) {
      hasGameFinishedBeenTrue.current = true;
    }
    if (hasGameFinishedBeenTrue.current) {
      const dataBody = {
        skill: "aim",
        score: parseFloat(calculateTotalScore(scores).toFixed(1)),
        token,
      };
      const sendData = async () => {
        const data = await sendGameData(dataBody);
        console.log("data: ", data);
        if (data) {
          console.log("msg from server: ", data.message);
          setSaveStatusMsg({
            success: data.message,
            error: "",
          });
        } else {
          setSaveStatusMsg({
            success: "",
            error: "Couldn't save your score",
          });
        }
      };
      sendData();
    }
  }, [hasGameFinished]);

  const handleStart = () => {
    setHasGameStarted(true);
    setCurrentTargetIndex(0);
    setScores(initialScores);
    setSaveStatusMsg({
      success: "",
      error: "",
    });
  };

  const handleTargetClick = (targetId: number) => {
    if (hasGameStarted && !hasGameFinished) {
      setTargets((prevTargets) => {
        const updateTargets = [...prevTargets];
        const clickedTarget = updateTargets.find(
          (target) => target.id === targetId
        );

        if (clickedTarget && clickedTarget.isVisible) {
          clickedTarget.times[1] = performance.now(); // Record the time when the target is clicked
          const timeTaken = clickedTarget.times[1] - clickedTarget.times[0];
          setScores((prevScore) => {
            const updatedScore = [...prevScore];
            updatedScore[targetId] = timeTaken;
            return updatedScore;
          });
        }
        updateTargets[targetId].isVisible = false;

        return updateTargets;
      });
    }
  };

  useEffect(() => {
    if (hasGameStarted && currentTargetIndex < MAX_TARGET_SIZE) {
      const timeout1 = setTimeout(() => {
        setTargets((prevState) => {
          const updateTargets = [...prevState];
          updateTargets[currentTargetIndex].isVisible = true;
          updateTargets[currentTargetIndex].times[0] = performance.now(); // Record the time when the target appears

          return updateTargets;
        });

        const timeout2 = setTimeout(() => {
          setTargets((prevState) => {
            const updateTargets = [...prevState];
            updateTargets[currentTargetIndex].isVisible = false;
            return updateTargets;
          });

          setCurrentTargetIndex((prevIndex) => prevIndex + 1);
        }, TARGET_TIME);

        return () => {
          clearTimeout(timeout2);
        };
      }, TARGET_TIME / 2);

      return () => {
        clearTimeout(timeout1);
      };
    }
  }, [hasGameStarted, currentTargetIndex]);

  return (
    <section className="game aim glass-container">
      <h1>Aim</h1>
      <div className="game__arena game__arena--aim">
        {!hasGameStarted && !hasGameFinished && (
          <>
            <p className="game__instructions">
              Hit the targets at the center point. Get many hits as fast as you
              can
            </p>

            <h6>For a better experience play it in a laptop or desktop</h6>

            <Button type="game" onClick={handleStart}>
              Start
            </Button>
          </>
        )}
        {hasGameStarted && !hasGameFinished && (
          <>
            {targets.map((target, id) => (
              <div
                key={id}
                className={`aim-target ${target.isVisible ? "active" : ""}`}
                style={randomPositions()}
              >
                <Target
                  type="aim"
                  onInnerCircleClick={() => handleTargetClick(target.id)} // Pass the callback
                />
              </div>
            ))}
          </>
        )}
        {hasGameFinished && (
          <>
            <p>Game finished!</p>
            <p className="game__results game__results--aim">
              Your total score is:{" "}
              <span>{calculateTotalScore(scores).toFixed(1)} ms</span>
              <span className="saved-msg">{saveStatusMsg.success}</span>
              <span className="saved-msg saved-msg--error">
                {saveStatusMsg.error}
              </span>
            </p>
            <Button type="game" onClick={handleReset}>
              Try Again
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
