import React, { useEffect, useState } from "react";
import ButtonBoard from "../ButtonBoard/ButtonBoard.js";
function GameBoard({ id, disabled }) {
  return (
    <div className="container-fluid">
      <div className="d-flex flex-row">
        {[1,2,3].map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
      <div className="d-flex flex-row">
        {[4,5,6].map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
      <div className="d-flex flex-row">
        {[7,8,9].map((element) => (
          <ButtonBoard key={element} id={element} disabled={false} />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
