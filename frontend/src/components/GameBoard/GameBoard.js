import React, { useEffect, useState } from "react";
import ButtonBoard from "../ButtonBoard/ButtonBoard.js";
function GameBoard({ id, disabled }) {
  return (
    <div className="container-fluid">
      <div className="d-flex flex-row">
        {Array.from(Array(3).keys()).map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
      <div className="d-flex flex-row">
        {Array.from(Array(3).keys()).map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
      <div className="d-flex flex-row">
        {Array.from(Array(3).keys()).map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
