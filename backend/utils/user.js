class User{
   constructor(userID,name,statusPlayer,tokenSymbol,connection){
      this.userID=userID;
      this.name=name;
      this.statusPlayer=statusPlayer;
      this.tokenSymbol=tokenSymbol;
      this.connection=connection;
   }    
}
module.exports =User;