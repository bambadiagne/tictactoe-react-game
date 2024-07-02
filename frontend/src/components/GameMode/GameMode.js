import React, { useEffect, useState } from "react";
import Button from "../Utils/Button/Button";
import ws from "../../utils/websocket";
import { DataFormat } from "../../utils/data";
import GameBoard from "components/GameBoard/GameBoard";
import { useNavigate } from "react-router";
import Spinner from "../Utils/Spinner/Spinner.js";
import Swal from "sweetalert2";

function GameMode() {
  useEffect(() => {
    document.title = "TicTacToe | Game Mode";
  }, []);
  const [marker, setMarker] = useState("⭕");
  const [showLevel, setShowLevel] = useState(false);
  const [game, setGame] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [board, setBoard] = useState([[], [], []]);
  const navigate = useNavigate();
  const handleIALevel = () => {
    setShowLevel(true);
    Swal.fire("Coming soon!");
  };
  const handleUpdateBoard = (data) => {
    const [x, y] = data;
    const k = marker === "⭕" ? "O" : "X";

    setGame((prevGame) => {
      const newGame = { ...prevGame };
      newGame.tab[x][y] = k;
      return newGame;
    });
    ws.send(
      JSON.stringify(
        new DataFormat("UPDATE_GAME", { game: { ...game, tab: board } })
      )
    );
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
      console.log("count", count);
      count++;
    }, 1000);
    setIntervalId(myInterval);
  };

  ws.onmessage = (mess) => {
    const result = JSON.parse(mess.data);
    if (result.message) {
      console.log(result.message);
      Swal.fire({
        title: "Opponent disconnected",
        text: `${result.message} disconnected`,
        icon: "warning",
      });
      navigate("../", { replace: true });
      return;
    }
    if (result.updatedGame) {
      console.log("updatedGame", result.updatedGame);
      setBoard(Array.from(result.updatedGame.tab));
      setGame(result.updatedGame);
      setShowSpinner(!showSpinner);
      setCurrentPlayer(result.updatedGame.room.users[0].name);
      setMarker(marker === "⭕" ? "❌" : "⭕");
      if (result.updatedGame.isFinished && result.updatedGame.winner) {
        const swalDetails =
          JSON.parse(localStorage.getItem("user")).name ===
          result.updatedGame.winner
            ? {
                title: "VICTORY",
                text: `You win against ${result.updatedGame.room.users[1]}`,
                icon: "success",
              }
            : {
                title: "DEFEAT",
                text: `You lose against ${result.updatedGame.room.users[0]}`,
                icon: "error",
              };
        Swal.fire({
          title: swalDetails.title,
          text: swalDetails.text,
          icon: swalDetails.icon,
        });
        navigate("../", { replace: true });
        return;
      } else if (result.updatedGame.isFinished) {
        Swal.fire({
          title: "No opponents found",
          text: "DRAW",
          icon: "warning",
        });
        navigate("../", { replace: true });
        return;
      }
      return;
    }
    if (result.game == null) {
      console.log(
        "Aucun joueur disponible!Veuillez reessayer plus tard ou inviter un ami"
      );
    } else {
      setGame(result.game);
      setBoard(Array.from(result.game.tab));
      const room = result.game.room;
      clearInterval(intervalId);
      setShowSpinner(room.users[0] === currentPlayer.name ? false : true);
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
            <GameBoard
              updateBoard={handleUpdateBoard}
              marker={marker}
              game={game}
              spinner={showSpinner}
              currentPlayer={currentPlayer}
            />
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
