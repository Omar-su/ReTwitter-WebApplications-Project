import { Tweet } from "./tweet";

export class User {

    userNameID : string;
    ownerName : string;
    password : string;
    bio : string;
    email : string;
    followers : number;
    following : number;
    tweets : Tweet[];
    
    constructor(userNameID : string, ownerName: string, email : string, password : string){
      this.userNameID = userNameID;
      this.ownerName = ownerName;
      this.password = password;
      this.email = email;
      this.bio = "";
      this.followers = 0;
      this.following = 0;
      this.tweets = [];
    }


    increaseFollowers(){
        this.followers += 1;
    }

    increaseFollowing(){
      this.following += 1;
    }

    newTweet(newTweet : Tweet){
      this.tweets.push(newTweet);
    }
    
    getTweets() : Array<Tweet>{
      return this.tweets;
    }

    getFollowers() : number {
      return this.followers;
    } 

    setBio(bio : string) {
      this.bio = bio;
    }

}