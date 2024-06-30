class Room{
    constructor(roomId,users,connections,isBot,step){
        this.roomId=roomId;
        this.users=users;
        this.connections=connections;
        this.isBot=isBot;
        this.step=step;
        this.tab=Array.from({length: 3}).fill(Array.from({length: 3},()=>0));
     }    
        
}

module.exports =Room;