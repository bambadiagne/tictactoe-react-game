import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      <div>
        <p>
          Powered by{" "}
          <a
            href="https://bambadiagne.github.io/"
            className="text-decoration-none"
          >
            @bambadiagne
          </a>
          <a
            href="https://github.com/bambadiagne/tictactoe-react-game"
            target="_blank"
          >
            <img
              src="https://img.shields.io/github/stars/bambadiagne/tictactoe-react-game?style=social"
              alt=""
            />
          </a>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
