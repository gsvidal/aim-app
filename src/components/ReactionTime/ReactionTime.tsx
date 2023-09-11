import React, { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import "./ReactionTime.scss";
import { sendGameData } from "../../api/adapter";

type GameStateObj = {
  hasGameStarted: boolean;
  hasColorChanged: boolean;
  times: DOMHighResTimeStamp[];
  reactionTime: number;
  isTooSoon: boolean;
  timerId: NodeJS.Timeout | undefined;
  attempts: number[];
  hasTotalAttempts: boolean;
  showFinalResults: boolean;
  totalScore: number;
};

type ReactionTimeProps = {
  token: string;
};

const TOTAL_ATTEMPTS = 3;
const LOWER_LIMIT_RANDOM = 1000;
const HIGHER_LIMIT_RANDOM = 5000;

export const ReactionTime: React.FC<ReactionTimeProps> = ({ token }) => {
  const initialValues = {
    hasGameStarted: false,
    hasColorChanged: false,
    times: [],
    reactionTime: 0,
    isTooSoon: false,
    timerId: undefined,
    attempts: [],
    hasTotalAttempts: false,
    showFinalResults: false,
    totalScore: 0,
  };

  const [gameState, setGameState] = useState<GameStateObj>(initialValues);
  const [saveStatusMsg, setSaveStatusMsg] = useState({
    success: "",
    error: "",
  });

  // Calculate the average score
  const calculateTotalScore = (attemptsList: number[]): number => {
    const average =
      attemptsList.reduce((total, attempt) => total + attempt, 0) /
      attemptsList.length;
    return average;
  };

  // Generate random time for color change
  const randomTime = (): number => {
    return (
      LOWER_LIMIT_RANDOM +
      (HIGHER_LIMIT_RANDOM - LOWER_LIMIT_RANDOM) * Math.random()
    );
  };

  // Handle the start of the game
  const handleStart = (): void => {
    const timeToChange = randomTime();
    const newTimerId = setTimeout(() => {
      setGameState((prevState) => ({
        ...prevState,
        hasColorChanged: true,
      }));
    }, timeToChange);
    setGameState((prevState) => ({
      ...prevState,
      hasGameStarted: true,
      timerId: newTimerId,
    }));
  };

  // Handle user's reaction
  const handleReaction = (): void => {
    const endTime: DOMHighResTimeStamp = performance.now();
    setGameState({
      ...gameState,
      times: [...gameState.times, endTime],
    });
  };

  // Handle reaction that's too soon
  const handleTooSoon = (): void => {
    setGameState({ ...gameState, isTooSoon: true });
  };

  // Handle restarting the game
  const handleRestartGame = (): void => {
    setGameState({
      ...gameState,
      hasGameStarted: false,
      hasColorChanged: false,
      times: [],
      reactionTime: 0,
      isTooSoon: false,
    });
    setSaveStatusMsg({
      success: "",
      error: ""
    })
    if (gameState.attempts.length === TOTAL_ATTEMPTS) {
      setGameState(initialValues);
    }
  };

  useEffect(() => {
    // Check if color has changed to start the timer
    if (gameState.hasColorChanged) {
      const startTime: DOMHighResTimeStamp = performance.now();

      setGameState({
        ...gameState,
        times: [...gameState.times, startTime],
      });
    }
  }, [gameState.hasColorChanged]);

  useEffect(() => {
    if (gameState.times.length === 2) {
      const reactTime: number = gameState.times[1] - gameState.times[0];
      setGameState((prevState) => ({
        ...prevState,
        reactionTime: reactTime,
      }));
      setGameState((prevState) => ({
        ...prevState,
        attempts: [...gameState.attempts, reactTime],
      }));
    }
  }, [gameState.times]);

  useEffect(() => {
    // Clear timer when user reacts too soon
    if (gameState.isTooSoon) {
      clearTimeout(gameState.timerId);
    }
  }, [gameState.isTooSoon]);

  useEffect(() => {
    // Check if all attempts are done and show final results
    if (gameState.attempts.length === TOTAL_ATTEMPTS) {
      const totalScore = calculateTotalScore(gameState.attempts);
      setGameState((prevState) => ({
        ...prevState,
        totalScore,
      }));
      setGameState((prevState) => ({
        ...prevState,
        hasTotalAttempts: true,
      }));
      setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          showFinalResults: true,
        }));
      }, 1500);
    }
  }, [gameState.attempts]);

  useEffect(() => {
    if (gameState.totalScore > 0) {
      const dataBody = {
        skill: "reaction-time",
        score: parseFloat(gameState.totalScore.toFixed(1)),
        token,
      };

      const sendData = async () => {
        const data = await sendGameData(dataBody);
        if (data) {
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
  }, [gameState.totalScore]);

  const {
    hasGameStarted,
    hasColorChanged,
    reactionTime,
    isTooSoon,
    hasTotalAttempts,
    showFinalResults,
    totalScore,
  } = gameState;

  return (
    <section className="game game glass-container">
      <h1>Reaction time</h1>
      <div
        className={`game__arena ${hasColorChanged ? "activated" : ""}`}
        onMouseDown={
          hasGameStarted && hasColorChanged && reactionTime === 0
            ? handleReaction
            : hasGameStarted && !hasColorChanged && !isTooSoon
            ? handleTooSoon
            : undefined
        }
      >
        {!hasGameStarted && !isTooSoon && (
          <>
            <p className="game__instructions">
              When the red box turns green, click as quickly as you can.
            </p>
            <Button type="game" onClick={handleStart}>
              Start
            </Button>
          </>
        )}
        {reactionTime !== 0 && !isTooSoon && (
          <>
            <p
              className={`game__results ${
                hasTotalAttempts && showFinalResults
                  ? "fade-out"
                  : hasTotalAttempts
                  ? "last"
                  : ""
              }`}
            >
              Your average score is: <span>{reactionTime.toFixed(1)} ms</span>
            </p>
            {hasTotalAttempts ? (
              <div
                className={`final__results ${
                  showFinalResults ? "fade-in" : ""
                }`}
              >
                <p className="game__results total-attempts">
                  Your total score is: <span>{totalScore.toFixed(1)} ms </span>
                  <span className="saved-msg">{saveStatusMsg.success}</span>
                  <span className="saved-msg saved-msg--error">
                    {saveStatusMsg.error}
                  </span>
                </p>
                <Button type="game" onClick={handleRestartGame}>
                  Try Again
                </Button>
              </div>
            ) : (
              <Button type="game" onClick={handleRestartGame}>
                Try Again
              </Button>
            )}
          </>
        )}
        {isTooSoon && (
          <>
            <p className="game__results too-soon">Too Soon!</p>
            <Button type="game" onClick={handleRestartGame}>
              Try Again
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
