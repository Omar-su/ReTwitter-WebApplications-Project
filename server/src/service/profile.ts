import { User } from "../model/profile";
import { Tweet } from "../model/tweet";

class ProfileService{

  tweets : Array<Tweet> = [];
  users : Array<User> = [];

  async getTweets(userID : string) : Promise<Array<Tweet> | null>{
    const user : User | undefined = this.users.find((user : User) => {
      return user.userNameID === userID;
    }); 
    if(user != null){ 
      const tweets = user.getTweets();
      return tweets;
    }else{
      return null;
    }   
  }

  async newFollower(userID : string) : Promise<boolean>{
    const user : User | undefined = this.users.find((user : User) => {
      return user.userNameID === userID;
    }); 
    if(user != null){ 
      user.increaseFollowing();
      return true;
    }else{
      return false;
    }    
  }
  
  
  async follow(userID : string) : Promise<boolean>{
    const user : User | undefined = this.users.find((user : User) => {
      return user.userNameID === userID;
    }); 
    if(user != null){ 
      user.increaseFollowing();
      return true;
    }else{
      return false;
    }  
  }
  
  
  async tweet(userID : string, description : string) : Promise<boolean>{
    const user : User | undefined = this.users.find((user : User) => {
      return user.userNameID === userID;
    }); 
    if(user != null){
      const newTweet = new Tweet(user.userNameID, description); 
      user.newTweet(newTweet);
      return true;
    }else{
      return false;
    }
  }

  // TODO TAKE THIS OUT OF HERE
  async createUser(userID : string, ownerName : string, bio : string) : Promise<User>{
    const newUser = new User(userID, ownerName, bio);
    this.users.push(newUser);
    return newUser;
  }
  
}

export function makeProfileService() : ProfileService{
  return new ProfileService;
}

