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
      if (tweet != null) {
        tweet.increaseNrLikes();
        return true;
      }

      const nestedReply : Reply | undefined = this.recrusiveIdSearch(id, this.tweets.flatMap((tweet) => tweet.replies));

      if (nestedReply == null) {
        return false;
      }
      nestedReply.increaseNrLikes();
      return true;
  }
  

  async replyOnTweet(id : number, author : string, description : string, origowner : string) :   Promise<boolean>{
    const reply = new Reply(author, description, origowner);

    const tweet : Tweet | undefined = this.tweets.find((tweet : Tweet) => {
      return tweet.id === id;
    }); 

    if (tweet != null) {
      tweet.addReply(reply);
      return true;
    }
    
    const nestedReply : Reply | undefined = this.recrusiveIdSearch(id, this.tweets.flatMap((tweet) => tweet.replies));

    if (nestedReply == null) {
      return false;
    }
    nestedReply.addReply(reply);
    return true;
  }

  // Search for a reply with an id recrusivaly 
  recrusiveIdSearch(id: number, replyToBeSearched : Reply[]) : Reply | undefined{
    for (const reply of replyToBeSearched) {
      if (reply.id === id) {
        return reply;
      }
      if (reply.replies) {
        const nestedReply = this.recrusiveIdSearch(id, reply.replies);
        if (nestedReply) {
          return nestedReply;
        }
      }
    }
    return undefined;
  }


}


export function makeTweetService() : TweetService {
  return new TweetService;
}


