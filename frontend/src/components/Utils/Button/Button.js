import React, { useEffect, useState } from "react";
function Button({ name, setclick }) {
  return (
    <div className="text-center">
      <button
        onClick={setclick}
        className="btn rounded  btn-primary h-100 w-100 p-3 "
      style={{fontFamily:"Arial Black"}}
      >
        {name}
      </button>
    </div>
  );
}

export default Button;
