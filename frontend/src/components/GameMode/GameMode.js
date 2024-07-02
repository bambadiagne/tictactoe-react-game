import React, { useEffect, useState } from "react";
import Button from "../Utils/Button/Button";
import ws from "../../utils/websocket";
import { DataFormat } from "../../utils/data";
import GameBoard from "components/GameBoard/GameBoard";
import Spinner from "../Utils/Spinner/Spinner.js";
import Swal from "sweetalert2";

function GameMode() {
  useEffect(() => {
    document.title = "TicTacToe | Game Mode";
  }, []);

  const [showLevel, setShowLevel] = useState(false);
  const [game, setGame] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    console.log("Game updated", game);
  }, [game]);
  const handleIALevel = () => {
    setShowLevel(true);
    Swal.fire("Coming soon!");
  };
  const handleShowGameMode = (gameStatus) => {
    setGame(null);
  };
  const createGame = (e) => {
    e.preventDefault();
    setShowSpinner(true);
    let count = 0;
    const user = JSON.parse(localStorage.getItem("user"));
    let myInterval = setInterval(() => {
      ws.send(
        JSON.stringify(new DataFormat("CREATE_GAME", { userID: user.userID }))
      );

      if (count === 10) {
        Swal.fire({
          title: "No opponents found",
          text: "Try again or invite a friend",
          icon: "info",
        });
        setShowSpinner(false);
        clearInterval(myInterval);
        ws.send(
          JSON.stringify(
            new DataFormat("UPDATE_USER", {
              userID: user.userID,
              statusPlayer: "NOT_PLAYING",
            })
          )
        );
      }
      count++;
    }, 1000);
    setIntervalId(myInterval);
  };

  ws.onmessage = (mess) => {
    const result = JSON.parse(mess.data);
    if (result.status && result.data.step === 0) {
      setGame(result.data);
      clearInterval(intervalId);
      setShowSpinner(false);
    }
  };

  return (
    <div className="container-fluid full-image-bg load-game-mode">
      <Spinner loading={showSpinner} />
      <div>
        <div hidden={game} className="">
          <h1 className="text-center p-5 text-dark play-bold">Game Mode 🎮</h1>
          <div className="d-flex flex-column w-80 my-5 justify-content-between">
            <div className="mb-5">
              <Button
                setclick={handleIALevel}
                classes="play-bold btn-lg"
                name={"🧑  VS  🤖"}
              />
            </div>
            <div className="">
              <Button
                classes="btn-lg"
                setclick={createGame}
                name={"🧑  VS  🧑"}
              />
            </div>
          </div>
        </div>
        {game && (
          <div>
            <GameBoard showGameMode={handleShowGameMode} game={game} />
          </div>
        )}
        <div hidden={true} className="pt-5">
          <div className="d-flex flex-column ">
            <div className="mb-5">
              <Button setclick={() => console.log("Nice")} name={"EASY"} />
            </div>
            <div className="mb-5">
              <Button setclick={() => console.log("Nice")} name={"MEDIUM"} />
            </div>
            <div className="mb-5">
              <Button setclick={() => console.log("Nice")} name={"HARD"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameMode;
