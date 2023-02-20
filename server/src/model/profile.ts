import { Tweet } from "./tweet";

export class User {

    userNameID : string;
    ownerName : string;
    passWord : string;
    bio : string;
    email : string;
    followers : number;
    following : number;
    Tweets : Array<Tweet>;
    
    constructor(userNameID : string, ownerName: string, email : string, passWord : string){
      this.userNameID = userNameID;
      this.ownerName = ownerName;
      this.passWord = passWord;
      this.email = email;
      this.bio = "";
      this.followers = 0;
      this.following = 0;
      this.Tweets = [];
    }


    increaseFollowers(){
        this.followers += 1;
    }

    increaseFollowing(){
      this.following += 1;
    }

    newTweet(newTweet : Tweet){
      this.Tweets.push(newTweet);
    }
    
    getTweets() : Array<Tweet>{
      return this.Tweets;
    }

    getFollowers() : number {
      return this.followers;
    } 

    setBio(bio : string) {
      this.bio = bio;
    }

}