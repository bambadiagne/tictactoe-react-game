import React from "react";
function Button({ name, setclick, classes }) {
  return (
    <div className="text-center">
      <button
        onClick={setclick}
        className={`btn rounded  btn-primary h-100 px-5 ${classes ?? ""} `}
        style={{ fontFamily: "Arial Black" }}
      >
        {name}
      </button>
    </div>
  );
}

export default Button;
