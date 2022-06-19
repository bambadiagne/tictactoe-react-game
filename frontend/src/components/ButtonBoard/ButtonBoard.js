import React, { useEffect, useState } from "react";

function ButtonBoard({ id, disabled }) {
  const [disabledButton, setDisabled] = useState(disabled);
  return (
    <div className="col rounded border border-primary m-2 w-100 h-100 shadow">
      <button
        onClick={() => setDisabled(true)}
        disabled={disabledButton}
        id={id}
        style={{ minHeight: "200px" }}
        className="h-100 p-1 w-100"
      ></button>
    </div>
  );
}

export default ButtonBoard;
