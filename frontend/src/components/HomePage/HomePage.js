import React, { useEffect, useState } from "react";
import Button from "../Utils/Button/Button";
import { useNavigate } from "react-router-dom";
import ws from "../../utils/websocket";
import { DataFormat } from "../../utils/data";
import homepage from "../../images/homepage.jpg";
function HomePage() {
  useEffect(() => {
    ws.onopen = () => {
      console.log("====================================");
      console.log("Logged into websocket");
      console.log("====================================");
    };
  }, []);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const signup = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Le nom est obligatoire");
    } else {
      ws.send(JSON.stringify(new DataFormat("ADD_USER", { name })));

      ws.onmessage = (mess) => {
        localStorage.setItem("user", mess.data);
        navigate("../gamemode", { replace: true });
      };
    }
  };
  return (
    <div className="mt-5 d-flex flex-row justify-content-sm-center">
      <div className="">
        <form onSubmit={signup} className="bg-light p-5 rounded shadow-lg">
          <div className="mb-5">
            <h1 className="text-dark">TicTacToe game</h1>
            <div>
              <img
                src={homepage}
                className="img-fluid rounded border"
                width={300}
                height={300}
              />
            </div>
          </div>

          <div className="d-flex flex-row  align-items-center ">
            <div className="form-group col">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                className="form-control p-2 rounded-0"
                placeholder="thegamer"
                name="name"
                id="name"
              />
            </div>
            <div className="col-auto px-0">
              {/* <button
                type="submit"
                className="rounded-0 rounded-end btn btn-primary font-weight-bold d-none d-sm-block"
              >
                Ajouter
              </button> */}
              <button
                type="submit"
                className="rounded-0 rounded-end btn btn-primary font-weight-bold "
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
