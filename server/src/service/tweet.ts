import { Tweet } from "../model/tweet";
import { Reply } from "../model/reply";

export class TweetService{
  
  tweets : Tweet[];

  constructor(){
    this.tweets = [];
  }

  getTweets() : Tweet[] {
    return this.tweets;
  }
  
  tweet(author : string, description : string) : Tweet {
    const newTweet = new Tweet(author, description);
    this.tweets.push(newTweet);
    return newTweet;
  }
  
  
  
  likeTweet(id : number) : boolean{
      const tweet : Tweet | undefined = this.tweets.find((tweet : Tweet) => {
        return tweet.id === id;
      }); 
      if (tweet == null) {
        return false;
      }
      tweet.increaseNrLikes();
      return true;
  }
  
  replyOnTweet(id : number, reply : Reply) : boolean{
    const tweet : Tweet | undefined = this.tweets.find((tweet : Tweet) => {
      return tweet.id === id;
    }); 
    if (tweet == null) {
      return false;
    }
    tweet.addReply(reply);
    return true;
  }
  
}


export function makeTweetService() : TweetService {
  return new TweetService;
}


