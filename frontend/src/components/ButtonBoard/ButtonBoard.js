import React, { useEffect, useState } from "react";

function ButtonBoard({ id, value, sendDataToParent, marker }) {
  const [disabledButton, setDisabled] = useState(false);

  useEffect(() => {
    if (value === "X" || value === "O") {
      document.getElementById(id).innerHTML =
        value === "X"
          ? "<i class='fas fa-times' style='color: blue;'></i>"
          : "<i class='fa-regular fa-circle' style='color: red;'></i>";
      document.getElementById(id).style.fontSize = "6vw";
      setDisabled(true);
    }
  }, [id]);

  const handleClick = (data) => {
    sendDataToParent(data);
    document.getElementById(id).innerHTML =
      value === "X"
        ? "<i class='fas fa-times' style='color: blue;'></i>"
        : "<i class='fa-regular fa-circle' style='color: red;'></i>";
    document.getElementById(id).style.fontSize = "6vw";

    setDisabled(true);
  };

  return (
    <div className="col rounded border border-primary m-2 w-100 h-100 shadow">
      <button
        onClick={() => handleClick(id)}
        disabled={disabledButton}
        id={id}
        style={{ minHeight: "200px" }}
        className="h-100 p-1 w-100"
      ></button>
    </div>
  );
}

export default ButtonBoard;
