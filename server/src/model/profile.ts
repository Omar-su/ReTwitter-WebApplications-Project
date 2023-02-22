import { Tweet } from "./tweet";

export class User {

    userNameID : string;
    ownerName : string;
    password : string;
    bio : string;
    email : string;
    followers : User[];
    following : User[];
    tweets : Tweet[];
    
    constructor(userNameID : string, ownerName: string, email : string, password : string){
      this.userNameID = userNameID;
      this.ownerName = ownerName;
      this.password = password;
      this.email = email;
      this.bio = "";
      this.followers = [];
      this.following = [];
      this.tweets = [];
    }


    addFollower(follower : User){
        this.followers.push(follower);
    }

    addFollowing(following : User){
      this.following.push(following);
  }

    newTweet(newTweet : Tweet){
      this.tweets.push(newTweet);
    }
    
    getTweets() : Array<Tweet>{
      return this.tweets;
    }

    getFollowers() : User[] {
      return this.followers;
    } 

    getFollowing() : User[] {
      return this.following;
    }

    setBio(bio : string) {
      this.bio = bio;
    }

}