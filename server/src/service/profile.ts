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

  async followProfile(followee : string, follower : string) : Promise<boolean>{
    const toBeFollowed : User | undefined = this.users.find((user : User) => {
      return user.userNameID === followee;
    }); 
    const toFollow : User | undefined = this.users.find((user : User) => {
      return user.userNameID === follower;
    }); 
    if (toBeFollowed == null || toFollow == null) {
      return false;
    }
    toBeFollowed.increaseFollowers();
    toFollow.increaseFollowing();
    return true;
}

async getProfiles() : Promise<Array<User>> {
  return this.users;
}

async getProfile(userID : string) : Promise<User | null> {
  console.log(userID)
  console.log(this.users)
  const user : User | undefined = this.users.find((user : User) => {
    return user.userNameID === userID;
  }); 
  if(user){
    return user;
  }
  return null;
}

  // TODO TAKE THIS OUT OF HERE
  async createUser(userID : string, ownerName : string, bio : string) : Promise<User>{
    const newUser = new User(userID, ownerName, bio);
    this.users.push(newUser);
    console.log(this.users)
    return newUser;
  }
  
}

export function makeProfileService() : ProfileService{
  return new ProfileService;
}

