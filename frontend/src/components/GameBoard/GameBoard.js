import React, { useEffect, useState } from "react";
import ButtonBoard from "../ButtonBoard/ButtonBoard.js";
import Spinner from "../Utils/Spinner/Spinner.js";
import ws from "../../utils/websocket";
import Swal from "sweetalert2";
import { DataFormat } from "../../utils/data";
import { useNavigate } from "react-router";

function GameBoard({ showGameMode, game }) {
  const [marker, setMarker] = useState("⭕");
  const [initGame, setGame] = useState(game);
  const [spinner, setShowSpinner] = useState(false);
  const [board, setBoard] = useState(game.tab);

  const [currentPlayer, setCurrentPlayer] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    document.title = "TicTacToe | Game Board";
    const room = initGame.room;
    setShowSpinner(room.users[0] === currentPlayer.name ? false : true);
  }, []);

  const navigate = useNavigate();
  const handleDataFromChild = (data) => {
    const [x, y] = data.split("-").slice(1);
    const k = marker === "⭕" ? "O" : "X";

    setGame((prevGame) => {
      const newGame = { ...prevGame, tab: Array.from(prevGame.tab) };
      newGame.tab[x][y] = k;
      return newGame;
    });
    ws.send(
      JSON.stringify(
        new DataFormat("UPDATE_GAME", { game: { ...initGame, tab: board } })
      )
    );
  };
  ws.onmessage = (mess) => {
    const result = JSON.parse(mess.data);

    if (result.status) {
      setGame(result.data);
      setBoard(Array.from(result.data.tab));
      setShowSpinner(!spinner);
      setCurrentPlayer(result.data.room.users[0].name);

      setMarker(marker === "⭕" ? "❌" : "⭕");
      if (result.data.isFinished && result.data.winner) {
        const swalDetails =
          JSON.parse(localStorage.getItem("user")).name === result.data.winner
            ? {
                title: "VICTORY",
                text: `You win against ${result.data.room.users[1]}`,
                icon: "success",
              }
            : {
                title: "DEFEAT",
                text: `You lose against ${result.data.room.users[0]}`,
                icon: "error",
              };
        Swal.fire({
          title: swalDetails.title,
          text: swalDetails.text,
          icon: swalDetails.icon,
        });
        showGameMode(true);
        return;
      } else if (result.data.isFinished) {
        Swal.fire({
          title: "No winner",
          text: "It's a draw!",
          icon: "warning",
        });
        showGameMode(true);
        return;
      }
      return;
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    }
    if(result.disconnected) showGameMode(true);

  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center">
      <div className="text-center">
        <Spinner loading={spinner} />
      </div>
      <div>
        {initGame.tab.map((row, rowIndex) => (
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
