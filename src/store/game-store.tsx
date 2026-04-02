import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { AirQualityItem, Category, AIR_ITEMS, shuffleArray } from '../data/air-quality-data';

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface DropResult {
  item: AirQualityItem;
  zone: Category;
  isCorrect: boolean;
  points: number;
}

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  status: GameStatus;
  score: number;
  aqi: number; // Air Quality Index
  timeLeft: number;
  items: AirQualityItem[];
  currentItemIndex: number;
  history: DropResult[];
  startGame: () => void;
  handleDrop: (item: AirQualityItem, zone: Category) => DropResult;
  resetGame: () => void;
  endGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const GAME_DURATION = 60; // 60 seconds

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [aqi, setAqi] = useState(50); // Starts at 50 (Moderate)
  const [timeLeft, setTimeLeft] = useState(0);
  const [items, setItems] = useState<AirQualityItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [history, setHistory] = useState<DropResult[]>([]);
  
  // Bug fix pattern: prevent double drops for the same index
  const lastProcessedIndexRef = useRef(-1);

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (status === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && status === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const startGame = () => {
    lastProcessedIndexRef.current = -1;
    setItems(shuffleArray(AIR_ITEMS));
    setCurrentItemIndex(0);
    setScore(0);
    setAqi(50);
    setHistory([]);
    setTimeLeft(GAME_DURATION);
    setStatus('playing');
  };

  const endGame = () => {
    setStatus('finished');
  };

  const handleDrop = (item: AirQualityItem, zone: Category): DropResult => {
    // Guard against double processing
    if (lastProcessedIndexRef.current === currentItemIndex) {
      return { item, zone, isCorrect: false, points: 0 };
    }
    lastProcessedIndexRef.current = currentItemIndex;

    const isCorrect = item.category === zone;
    const points = isCorrect ? 10 : -5;
    
    // Update AQI based on actions
    let newAqi = aqi;
    if (isCorrect && item.category === 'cleans') {
      newAqi = Math.max(0, newAqi - 5); // Cleans air -> improves AQI
    } else if (!isCorrect && item.category === 'pollutes') {
      newAqi = Math.min(200, newAqi + 10); // Missed polluter -> worsens AQI
    } else if (!isCorrect && zone === 'pollutes') {
      newAqi = Math.min(200, newAqi + 5); // Falsely accusing something of polluting -> slight penalty to logic
    }
    
    setScore((prev) => Math.max(0, prev + points));
    setAqi(newAqi);
    
    const result = { item, zone, isCorrect, points };
    setHistory((prev) => [...prev, result]);

    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    } else {
      endGame();
    }

    return result;
  };

  const resetGame = () => {
    setStatus('idle');
    setScore(0);
    setAqi(50);
    setHistory([]);
    setCurrentItemIndex(0);
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        status,
        score,
        aqi,
        timeLeft,
        items,
        currentItemIndex,
        history,
        startGame,
        handleDrop,
        resetGame,
        endGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
