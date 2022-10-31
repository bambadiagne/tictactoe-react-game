import React, {useState } from "react";
import Button from "../Utils/Button/Button";
import ws from '../../utils/websocket';
function GameMode() {
  
  const [showLevel,setShowLevel]=useState(false);
  return (
    <div className="container-fluid full-image-bg load-game-mode">
        <div>
          <div hidden={showLevel} className="">
            <h1 className="text-center p-5 text-white">Mode de Jeu</h1>
            <div className=" row w-80 my-5">
              <div className="col">
              <Button setclick={() =>setShowLevel(true)} name={"PLAYER VS IA"} />
            
              </div>
            <div className="col">
            <Button setclick={() => console.log("Nice")} name={"PLAYER VS PLAYER"} />
            
            </div>
              
            </div>
          
        </div>
        <div hidden={!showLevel} className="pt-5">
          <div className="d-flex flex-column ">
            <div className="mb-5">
            <Button setclick={() => console.log("Nice")} name={"FACILE"} />
         
            </div>
            <div className="mb-5">
            <Button setclick={() => console.log("Nice")} name={"MOYEN"} />
         
            </div>
            <div className="mb-5">
            <Button setclick={() => console.log("Nice")} name={"DIFFICILE"} />
         
            </div>
          
          </div>
        </div>
        </div>
    </div>
    );
}

export default GameMode;
