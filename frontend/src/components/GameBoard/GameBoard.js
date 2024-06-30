import React, { useEffect, useState } from "react";
import ButtonBoard from "../ButtonBoard/ButtonBoard.js";
import Spinner from "../Utils/Spinner/Spinner.js";
function GameBoard({ game,spinner }) {
  const [timer, setTimer] = useState(30);
  const [intervalId, setIntervalId] = useState(null);
  // const [content, setContent] = useState('');
  // const change = () => {
  //   setContent((prevContent) => (prevContent === '❌' ? '⭕' : '❌'));
  // };
  const buttonConfig = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["O", "X", "X"],
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
      console.log("Timer", timer);
      
    }, 1000);
    if(timer===0){
      setTimer(30);
    }
    setIntervalId(interval);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center">
      <div hidden={spinner} className="">
        <p>Player is playing</p>
      <Spinner loading={spinner} />
      </div>
      <div hidden={!spinner}>    
      <h3>Timer 00:{timer}s</h3>
      {buttonConfig.map((row, rowIndex) => (
        <div key={rowIndex} className="d-flex flex-row">
          {row.map((element,index) => (
            <ButtonBoard  key={`${element}-${rowIndex}-${index}`} id={`${element}-${rowIndex}-${index}`} disabled={false} />
          ))}
        </div>
      ))}
      </div>
    </div>
  );
    
    
}

export default GameBoard;
