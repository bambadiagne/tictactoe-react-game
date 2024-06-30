import React, {useState } from "react";
import Button from "../Utils/Button/Button";
import ws from '../../utils/websocket';
import {DataFormat} from "../../utils/data";
import GameBoard from "components/GameBoard/GameBoard";
import { clear } from "@testing-library/user-event/dist/clear";
function GameMode() {
  
  const [showLevel,setShowLevel]=useState(false);
  const [game,setGame]=useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const createGame=(e)=>{
    e.preventDefault();
    let count =0;
    const user= JSON.parse(localStorage.getItem('user'));
     let myInterval = setInterval(()=>{
      
      
      ws.send(JSON.stringify(new DataFormat("CREATE_GAME",{userID:user.userID})));
        
      if(count===3){
        clearInterval(myInterval);
      }
      count++;
      }, 1000);
    setIntervalId(myInterval);
  }
      
    ws.onmessage=(mess)=>{
      const result = JSON.parse(mess.data);
      console.log('BEFORE DATA',result);
      if(result.game==null){
        console.log("Aucun joueur disponible!Veuillez reessayer plus tard ou inviter un ami");
      }else{
        console.log('DATA',result);    
        setGame(result.game); 
        clearInterval(intervalId);
        ws.send(JSON.stringify(new DataFormat("GET_SINGLE_ROOM",{roomId:result.game.room})));
      }
      
       
    };
    
     
   
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
            <Button setclick={createGame} name={"PLAYER VS PLAYER"} />
            
            </div>
              
            </div>
          
        </div>
        <div hidden={!game}>
          <GameBoard game={game} />
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
