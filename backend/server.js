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
    console.log("====================================");
    console.log(type, dataReceived);
    console.log("====================================");

    switch (type) {
      case "ADD_USER":
        allUsers["result"].push(
          new User(
            crypto.randomUUID(),
            dataReceived.name,
            StatusPlayer.NOT_PLAYING
          )
        );
        break;
      case "CREATE_GAME":
        const userId = allUsers.result.find((user) => (user.id = data.userId));
        allUsers.result[userId].statusPlayer = StatusPlayer.WANT_TO_PLAY;
        const roomID = crypto.randomUUID();
        allRooms.rooms.push(new Room(roomID, [dataReceived.userId]));
        if (dataReceived.isBot) {
          const newGame = new Game(roomID, 0, true);
          ws.send(JSON.stringify(newGame));
        } else {
          const availablesPlayers = allUsers.result.filter(
            (player) =>
              (player.statusPlayer =
                StatusPlayer.WANT_TO_PLAY && player.id != userId)
          );
          if (availablesPlayers.length > 0) {
            const randomUser =
              availablesPlayers[
                Math.floor(Math.random() * availablesPlayers.length)
              ];
            ws.send(
              JSON.stringify({ game: new Game(roomID, 0, false), userId })
            );
          } else {
          }
        }

      case "GAME_VS_IA":
        break;
      case "GAME_VS_PLAYERS":
        break;
      default:
        break;
    }
    ws.send(JSON.stringify(allUsers));
  });
});

server.on("error", errorHandler);
server.on("listening", () => {
  const address = wss.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port);
