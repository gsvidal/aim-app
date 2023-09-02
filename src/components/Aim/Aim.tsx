import { useState } from 'react';
import './Aim.scss';

type AimProps = {
  token: string;
};

type GameStateObj = {

}

export const Aim: React.FC<AimProps> = ({ token }) => {
  const [gameState, setGameState] = useState<GameStateObj>({});

  return (
    <>
    </>
  );
};
