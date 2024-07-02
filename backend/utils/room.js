class Room {
  constructor(roomId, users, connections) {
    this.roomId = roomId;
    this.users = users;
    this.connections = connections;
  }
}

module.exports = Room;
