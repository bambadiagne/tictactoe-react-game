import React, { useEffect, useState } from "react";
import ButtonBoard from "../ButtonBoard/ButtonBoard.js";
import Spinner from "../Utils/Spinner/Spinner.js";
function GameBoard({ game, spinner, currentPlayer, marker, updateBoard }) {
  const [timer, setTimer] = useState(30);
  const [intervalId, setIntervalId] = useState(null);

  const handleDataFromChild = (data) => {
    updateBoard(data.split("-").slice(1));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    if (timer === 0) {
      setTimer(30);
    }
    setIntervalId(interval);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center">
      <div className="text-center">
        <Spinner loading={spinner} />
      </div>
      <div>
        {/* <h2>Timer 00:{timer}s</h2> */}
        {game.tab.map((row, rowIndex) => (
          <div key={rowIndex} className={`d-flex flex-row ${rowIndex} `}>
            {row.map((element, index) => (
              <ButtonBoard
                value={element}
                marker={marker}
                sendDataToParent={handleDataFromChild}
                key={`${element}-${rowIndex}-${index}`}
                id={`D-${rowIndex}-${index}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
