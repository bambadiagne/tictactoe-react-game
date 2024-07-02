class Game {
  constructor(room, step, isBot) {
    this.room = room;
    this.step = step;
    this.isBot = isBot;
    this.finished = false;
    this.tab = Array.from({ length: 3 }).fill(
      Array.from({ length: 3 }, () => 0)
    );
  }
}

module.exports = Game;
