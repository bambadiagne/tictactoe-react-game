 class Game{
    constructor(roomId,step,isBot){
        this.roomId=roomId;
        this.step=step;
        this.isBot=isBot;
        this.tab=Array.from({length: 3}).fill(Array.from({length: 3},()=>0));
     }    
        
}

module.exports =Game;