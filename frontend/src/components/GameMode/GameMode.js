import React, { useState } from "react";
import Button from "../Utils/Button/Button";
import ws from "../../utils/websocket";
import { DataFormat } from "../../utils/data";
import GameBoard from "components/GameBoard/GameBoard";
import { useNavigate } from "react-router";
function GameMode() {
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

  const handleUpdateBoard = (data) => {
    const [x, y] = data;
    const k = marker === "⭕" ? "O" : "X";

    setGame((prevGame) => {
      const newGame = { ...prevGame };
      newGame.tab[x][y] = k;
      return newGame;
    });
    console.log("Update board", board);
    ws.send(
      JSON.stringify(
        new DataFormat("UPDATE_GAME", { game: { ...game, tab: board } })
      )
    );
  };
  const createGame = (e) => {
    e.preventDefault();
    let count = 0;
    const user = JSON.parse(localStorage.getItem("user"));
    let myInterval = setInterval(() => {
      ws.send(
        JSON.stringify(new DataFormat("CREATE_GAME", { userID: user.userID }))
      );

      if (count === 10) {
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
    if (result.updatedGame) {
      setBoard(Array.from(result.updatedGame.tab));
      setGame(result.updatedGame);
      setShowSpinner(!showSpinner);
      setCurrentPlayer(result.updatedGame.room.users[0].name);
      setMarker(marker === "⭕" ? "❌" : "⭕");
      if (result.updatedGame.isFinished && result.updatedGame.winner) {
        alert(`Le gagnant est ${result.updatedGame.winner}`);
        navigate("../", { replace: true });
        return;
      } else if (result.updatedGame.isFinished) {
        alert("Match nul");
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
      <div>
        <div hidden={game} className="">
          <h1 className="text-center p-5 text-white">Mode de Jeu</h1>
          <div className=" row w-80 my-5">
            <div className="col">
              <Button
                setclick={() => setShowLevel(true)}
                name={"PLAYER VS IA"}
              />
            </div>
            <div className="col">
              <Button setclick={createGame} name={"PLAYER VS PLAYER"} />
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
              <Button setclick={() => console.log("Nice")} name={"FACILE"} />
            </div>
            <div className="mb-5">
              <Button setclick={() => console.log("Nice")} name={"MOYEN"} />
            </div>
            <div className="mb-5">
              <Button setclick={() => console.log("Nice")} name={"DIFFICILE"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameMode;
