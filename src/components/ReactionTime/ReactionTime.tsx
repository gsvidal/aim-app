import React, { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import "./ReactionTime.scss";
import { sendGameData } from "../../api/adapter";

const TOTAL_ATTEMPTS = 2;
const LOWER_LIMIT_RANDOM = 1000;
const HIGHER_LIMIT_RANDOM = 3000;

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

export const ReactionTime: React.FC<ReactionTimeProps> = ({token}) => {
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
  const [successMsg, setSuccessMsg] = useState<string>("")

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
    console.log("handleStart");
    const timeToChange = randomTime();
    const newTimerId = setTimeout(() => {
      console.log("color has changed/ time has passed");
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
    console.log("handleReaction");
    const endTime: DOMHighResTimeStamp = performance.now();
    setGameState({
      ...gameState,
      times: [...gameState.times, endTime],
    });
  };

  // Handle reaction that's too soon
  const handleTooSoon = (): void => {
    console.log("handleTooSoon");
    setGameState({ ...gameState, isTooSoon: true });
  };

  // Handle restarting the game
  const handleRestartGame = (): void => {
    console.log("shallow RestartGame");
    setGameState({
      ...gameState,
      hasGameStarted: false,
      hasColorChanged: false,
      times: [],
      reactionTime: 0,
      isTooSoon: false,
    });
    if (gameState.attempts.length === TOTAL_ATTEMPTS) {
      console.log("deep everything restarted");
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
      console.log("round finished");
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
      console.log("game finished");
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
      console.log("sending data to server");
      console.log("data:", gameState.totalScore);
      async function sendData() {
        const data = await sendGameData(token);
        if (data) {
          console.log(data.message)
          setSuccessMsg(data.message);
        } else {
          console.log("Couldn't save your score")
        }
      }
  
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
    <section className="reaction-time glass-container">
      <h1>Reaction time</h1>
      <div
        className={`reaction-time__arena ${hasColorChanged ? "activated" : ""}`}
        onClick={
          hasGameStarted && hasColorChanged && reactionTime === 0
            ? handleReaction
            : hasGameStarted && !hasColorChanged && !isTooSoon
            ? handleTooSoon
            : undefined
        }
      >
        {!hasGameStarted && !isTooSoon && (
          <>
            <p className="reaction-time__instructions">
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
              className={`reaction-time__results ${
                hasTotalAttempts && showFinalResults
                  ? "fade-out"
                  : hasTotalAttempts
                  ? "last"
                  : ""
              }`}
            >
              Your score is: <span>{reactionTime.toFixed(1)} ms</span>
            </p>
            {hasTotalAttempts ? (
              <div
                className={`final__results ${
                  showFinalResults ? "fade-in" : ""
                }`}
              >
                <p className="reaction-time__results total-attempts">
                  Your total score is:{" "}
                  <span>
                    {totalScore.toFixed(1)} ms{" "}
                    <span className="saved-msg">{successMsg}</span>
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
            <p className="reaction-time__results too-soon">Too Soon!</p>
            <Button type="game" onClick={handleRestartGame}>
              Try Again
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
