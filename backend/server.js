"use strict";
const User = require("./utils/user");
const Game = require("./utils/game");
const Room = require("./utils/room");
const StatusPlayer = require("./utils/status-player");
const http = require("http");
const crypto = require("crypto");
const app = require("./app");
const WebSocket = require("ws");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer({ app });
const wss = new WebSocket.Server({ server });
const allUsers = { result: [] };
const allRooms = { rooms: [] };
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    const { type, dataReceived } = JSON.parse(data);
    // console.log("====================================");
    // console.log(type, dataReceived);
    // console.log("====================================");

    switch (type) {
      case "ADD_USER":
        const user = new User(
          crypto.randomUUID(),
          dataReceived.name,
          StatusPlayer.NOT_PLAYING,
          "",
          ws
        );
        allUsers["result"].push(user);
        ws.send(JSON.stringify(user));
        break;
      case "CREATE_GAME":
        const userJoin = allUsers.result.find(
          (user) => user.userID === dataReceived.userID
        );
        allUsers.result[allUsers.result.indexOf(userJoin)].statusPlayer =
          StatusPlayer.WANT_TO_PLAY;

        // console.log("====================================");
        // console.log('test',allUsers.result[allUsers.result.indexOf(userJoin)]);
        // console.log("====================================");

        if (dataReceived.isBot) {
          allUsers.result[allUsers.result.indexOf(userJoin)].tokenSymbol = "X";
          const newGame = new Game(room, 0, true);
          ws.send(JSON.stringify(newGame));
        } else {
          const availablesPlayers = allUsers.result.filter(
            (player) =>
              player.statusPlayer === StatusPlayer.WANT_TO_PLAY &&
              player.userID !== userJoin.userID
          );

          //   console.log("====================================");
          // console.log('availablesPlayers',availablesPlayers.length);
          // console.log("====================================");
          if (availablesPlayers.length > 0) {
           
            const randomUser =
              availablesPlayers[
                Math.floor(Math.random() * availablesPlayers.length)
              ];
            allUsers.result[allUsers.result.indexOf(userJoin)].statusPlayer =
              StatusPlayer.IS_PLAYING;
            allUsers.result[allUsers.result.indexOf(randomUser)].statusPlayer =
              StatusPlayer.IS_PLAYING;
            // allUsers.result[allUsers.result.indexOf(userJoin)].tokenSymbol =
            //   "❌";
            // allUsers.result[allUsers.result.indexOf(randomUser)].tokenSymbol =
            //   "O";
            const room = new Room(crypto.randomUUID(), [],[userJoin.connection],false);
            allRooms.rooms.push(room);
             delete userJoin.connection;
             room.users.push(userJoin);
             room.connections.push(randomUser.connection);
             delete randomUser.connection;
             room.users.push(randomUser);
            const newGame = new Game(JSON.stringify(room), 0, false);
           room.connections.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ game: newGame }));
              }
            });
            
          
          } else {
            ws.send(JSON.stringify({ game: null }));
          }
        }
      case "GET_SINGLE_ROOM":
        console.log("dataReceived",dataReceived);
        if(dataReceived.roomId){
          const room = allRooms.rooms.find(room=>room.roomId===dataReceived.roomId);
          console.log("room",room);
          ws.send(JSON.stringify(room));
        }
        else{
          ws.send(JSON.stringify({room:null}));
        }
        break;
      case "GAME_VS_IA":
        break;
      case "GAME_VS_PLAYERS":
        break;
      default:
        break;
    }
    // ws.send(JSON.stringify(allUsers));
  });
});

server.on("error", errorHandler);
server.on("listening", () => {
  const address = wss.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port);
