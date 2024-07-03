"use strict";
const User = require("./utils/user");
const Game = require("./utils/game");
const Room = require("./utils/room");
// import { checkMatrix } from './utils/checkMatrix.js';
const StatusPlayer = require("./utils/status-player");
const http = require("http");
const crypto = require("crypto");
const app = require("./app");
const WebSocket = require("ws");
const { checkMatrix } = require("./utils/checkMatrix");
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
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};
const broadCastRoom = (room, data) => {
  room.connections.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};
const clearRoom = (room) => {
  console.log('room connections',room.connections.length);
  room.users.forEach((user) => {
    const userIndex = allUsers.result.findIndex(
      (u) => u.userID === user.userID
    );
    allUsers.result[userIndex].statusPlayer = StatusPlayer.NOT_PLAYING;
  });
  const index = allRooms.rooms.findIndex((r) => r.roomId === room.roomId);
  allRooms.rooms.splice(index, 1);
};
const server = http.createServer({ app });
const wss = new WebSocket.Server({ server });
const allUsers = { result: [] };
const allRooms = { rooms: [] };
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    const { type, dataReceived } = JSON.parse(data);

    switch (type) {
      case "ADD_USER":
        const isAlreadyUser = allUsers.result.find((user) => user.name === dataReceived.name);
        if(!isAlreadyUser){
        const uniqueId = crypto.randomUUID();
        ws.id = uniqueId;
        const user = new User(
          uniqueId,
          dataReceived.name,
          StatusPlayer.NOT_PLAYING,
          "",
          ws
        );
        allUsers["result"].push(user);
        ws.send(JSON.stringify({data:user,status:true}));
        return;
      }
      ws.send(JSON.stringify({ status:false, message: "User already exists" }));
        break;
      case "UPDATE_USER":
        const userUpdate = allUsers.result.find(
          (user) => user.userID === dataReceived.userID
        );
        allUsers.result[allUsers.result.indexOf(userUpdate)].statusPlayer =
          dataReceived.statusPlayer;
        break;
      case "CREATE_GAME":
        const userJoin = allUsers.result.find(
          (user) => user.userID === dataReceived.userID
        );
        allUsers.result[allUsers.result.indexOf(userJoin)].statusPlayer =
          StatusPlayer.WANT_TO_PLAY;

        if (dataReceived.isBot) {
          allUsers.result[allUsers.result.indexOf(userJoin)].tokenSymbol = "X";
          const newGame = new Game(room, 0, true);
          ws.send(JSON.stringify({data:newGame,status:true}));
        } else {
          const availablesPlayers = allUsers.result.filter(
            (player) =>
              player.statusPlayer === StatusPlayer.WANT_TO_PLAY &&
              player.userID !== userJoin.userID
          );

          if (availablesPlayers.length > 0) {
            const randomUser =
              availablesPlayers[
                Math.floor(Math.random() * availablesPlayers.length)
              ];
            allUsers.result[allUsers.result.indexOf(userJoin)].statusPlayer =
              StatusPlayer.IS_PLAYING;
            allUsers.result[allUsers.result.indexOf(randomUser)].statusPlayer =
              StatusPlayer.IS_PLAYING;
            const room = new Room(
              crypto.randomUUID(),
              [],
              [userJoin.connection],
              false
            );
            allRooms.rooms.push(room);
            room.users.push(userJoin);
            room.connections.push(randomUser.connection);
            room.users.push(randomUser);
            const newGame = new Game(
              {
                roomId: room.roomId,
                users: room.users.map((user) => user.name),
              },
              0,
              false
            );
            room.connections.forEach((client) => {
              console.log("client",client.id);
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ data: newGame,status:true }));
              }
            });
          } 
        }
      case "GET_SINGLE_ROOM":
        
        if (dataReceived.roomId) {
          const room = allRooms.rooms.find(
            (room) => room.roomId === dataReceived.roomId
          );
          ws.send(JSON.stringify({data:room,status:true}));
        }
        break;
      case "UPDATE_GAME":
        dataReceived.game.step = dataReceived.game.step + 1;
        
        const room = allRooms.rooms.find(
          (room) => room.roomId === dataReceived.game.room.roomId
        );
        if (dataReceived.game.step >= 4) {
          const { result, element } = checkMatrix(dataReceived.game.tab);
          
          if (result) {
            dataReceived.game.winner = element === "O" ? dataReceived.game.room.users[0] : dataReceived.game.room.users[1];
            dataReceived.game.isFinished = true;
            clearRoom(room);
          } else if (dataReceived.game.step === 9) {
            dataReceived.game.isFinished = true;
            clearRoom(room);
          }
        }
        broadCastRoom(room, { data: dataReceived.game, status: true });

        break;
      default:
        break;
    }
 },)
  .on("close",() => {
    const userIndex = allUsers.result.findIndex(user => user.userID === ws.id);
    if (userIndex !== -1) {
       allUsers.result[userIndex].statusPlayer = StatusPlayer.NOT_PLAYING;
       const indexRoom = allRooms.rooms.findIndex(room => room.users.includes(allUsers.result[userIndex]));
        if (indexRoom !== -1) {
          allRooms.rooms[indexRoom].connections.forEach((client) => {
            client.send(JSON.stringify({ message:`Your opponent ${allUsers.result[userIndex].name} is disconnected`,status:false,disconnected:true }));
          });
        }
      console.log(`User ${allUsers.result[userIndex].name} disconnected`);
      allUsers.result.splice(userIndex, 1);
      
    }
  })
  
});

server.on("error", errorHandler);
server.on("listening", () => {
  const address = wss.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port);
