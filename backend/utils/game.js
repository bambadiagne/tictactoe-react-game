class Game {
  constructor(room, step, isBot) {
    this.room = room;
    this.step = step;
    this.isBot = isBot;
    this.finished = false;
    this.tab = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"]
    ];
    
  }
}

module.exports = Game;
