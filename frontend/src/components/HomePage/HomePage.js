import React, { useEffect, useState } from "react";
import Button from "../Utils/Button/Button";
function HomePage() {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  console.log(name);
  return (
    <div className="full-image-bg load-home d-flex flex-row justify-content-center">
      <div hidden={showForm} style={{ paddingTop: "10%" }}>
        <div style={{ marginBottom: "20%" }}>
          <h1 className="text-white">Welcome to the TicTacToe game</h1>
        </div>
        <Button setclick={() => setShowForm(true)} name={"Jouer"} />
      </div>
      <div className="my-auto">
        <form hidden={!showForm} className="bg-light p-5 rounded shadow-lg">
          <h2 className="text-center mb-2">Inscription</h2>
          <div className="row">
            <div className="form-group d-flex flex-row rounded">
              <div className="border bg-primary p-2 m-0">
                <i className="fa-solid fa-user"></i>
              </div>
              <div>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  className="form-control p-2"
                  placeholder="Entrer votre nom"
                  name="name"
                  id="name"
                  htmlFor="name"
                />
              </div>
            </div>
          </div>
          <div className="row mt-4 text-center">
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary px-5 font-weight-bold"
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
