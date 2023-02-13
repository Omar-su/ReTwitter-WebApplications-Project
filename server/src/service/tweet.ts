import { Tweet } from "../model/tweet";
import { Reply} from "../model/reply";

class TweetService{
  
  tweets : Array<Tweet> = [];


  async getTweets() : Promise<Array<Tweet>> {
    return this.tweets;
  }
  
  async tweet(author : string, description : string) : Promise<Tweet> {
    const newTweet = new Tweet(author, description);
    this.tweets.push(newTweet);
    return newTweet;
  }
  
  
  
  async likeTweet(id : number) : Promise<boolean>{
      const tweet : Tweet | undefined = this.tweets.find((tweet : Tweet) => {
        return tweet.id === id;
      }); 
      if (tweet == null) {
        return false;
      }
      tweet.increaseNrLikes();
      return true;
  }
  
  async replyOnTweet(id : number, author : string, description : string, origowner : string) : Promise<boolean>{
    const tweet : Tweet | undefined = this.tweets.find((tweet : Tweet) => {
      return tweet.id === id;
    }); 
    if (tweet == null) {
      return false;
    }
    const reply = new Reply(author, description, origowner);
    tweet.addReply(reply);
    return true;
  }


}


export function makeTweetService() : TweetService {
  return new TweetService;
}


