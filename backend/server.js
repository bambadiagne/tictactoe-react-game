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
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
const broadCastRoom = (room, data) => {
  room.connections.forEach((client) => {
    client.send(JSON.stringify(data));
  });
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
        ws.send(JSON.stringify(user));
        break;
      case "UPDATE_USER":
        console.log("Update user", dataReceived);
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
          ws.send(JSON.stringify(newGame));
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
            delete userJoin.connection;
            room.users.push(userJoin);
            room.connections.push(randomUser.connection);
            delete randomUser.connection;
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
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ game: newGame }));
              }
            });
          } else {
            ws.send(JSON.stringify({ game: null }));
            // allUsers.result[allUsers.result.indexOf(userJoin)].statusPlayer =
            // StatusPlayer.NOT_PLAYING;
          }
        }
      case "GET_SINGLE_ROOM":
        if (dataReceived.roomId) {
          const room = allRooms.rooms.find(
            (room) => room.roomId === dataReceived.roomId
          );
          ws.send(JSON.stringify(room));
        } else {
          ws.send(JSON.stringify({ room: null }));
        }
        break;
      case "UPDATE_GAME":
        const room = allRooms.rooms.find(
          (room) => room.roomId === dataReceived.game.room.roomId
        );
        if (dataReceived.game.step >= 4) {
          console.log("after 4 steps", dataReceived.game.tab);
          const { result, element } = checkMatrix(dataReceived.game.tab);
          if (result) {
            dataReceived.game.winner =
              element === "O"
                ? dataReceived.game.room.users[0]
                : dataReceived.game.room.users[1];
            dataReceived.game.isFinished = true;
            console.log("Winner", dataReceived.game.winner);
            // ws.send(JSON.stringify({ updatedGame: dataReceived.game }));
            broadCastRoom(room, { updatedGame: dataReceived.game });
          }
          broadCastRoom(room, { updatedGame: dataReceived.game });
        } else if (dataReceived.game.step === 8) {
          dataReceived.game.isFinished = true;
          broadCastRoom(room, { updatedGame: dataReceived.game });
        } else {
          dataReceived.game.step = dataReceived.game.step + 1;
          // room.connections.forEach((client) => {
          //   client.send(JSON.stringify({ updatedGame: dataReceived.game }));
          // });
          broadCastRoom(room, { updatedGame: dataReceived.game });
        }

        break;
      default:
        break;
    }
  
  },)
  .on("close",() => {
    console.log("ws",ws);
        console.log("User disconnected");
      console.log("usersss",allUsers.result);  
    const userIndex = allUsers.result.findIndex(user => user.userID === ws.id);
    console.log("User index", userIndex);
    if (userIndex !== -1) {
      console.log(`User ${allUsers.result[userIndex].name} disconnected because of connection closed`);
       allUsers.result[userIndex].statusPlayer = StatusPlayer.NOT_PLAYING;
       const indexRoom = allRooms.rooms.findIndex(room => room.users.includes(allUsers.result[userIndex]));
        if (indexRoom !== -1) {
          console.log("Index room",indexRoom);
          allRooms.rooms[indexRoom].connections.forEach((client) => {
            client.send(JSON.stringify({ message:`Your opponent is disconnected` }));
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
