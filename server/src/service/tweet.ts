import { Tweet } from "../model/tweet";
import { Reply} from "../model/reply";
import { User } from "../model/profile"

class TweetService{
  
  async getTweets(user : User) : Promise<Array<Tweet>> {
    return user.tweets;
  }
  
  async tweet(user : User, description : string) : Promise<Tweet> {
    const newTweet = new Tweet(user.ownerName, description);
    console.log(user);
    user.tweets.push(newTweet);
    return newTweet;
  }
  
  
  
  async likeTweet(user : User, id : number) : Promise<boolean>{
      const tweet : Tweet | undefined = user.tweets.find((tweet : Tweet) => {
        return tweet.id === id;
      }); 
      if (tweet != null) {
        tweet.numberOfLikes += 1;
        return true;
      }

      const nestedReply : Reply | undefined = this.recrusiveIdSearch(id, user.tweets.flatMap((tweet) => tweet.replies));

      if (nestedReply == null) {
        return false;
      }
      nestedReply.numberOfLikes += 1;
      return true;
  }
  

  async replyOnTweet(user : User, id : number, description : string, origowner : string) :   Promise<boolean>{
    const reply = new Reply(user.ownerName, description, origowner);

    const tweet : Tweet | undefined = user.tweets.find((tweet : Tweet) => {
      return tweet.id === id;
    }); 

    if (tweet != null) {
      tweet.replies.push(reply);
      tweet.numberOfReplies += 1;
      return true;
    }
    
    const nestedReply : Reply | undefined = this.recrusiveIdSearch(id, user.tweets.flatMap((tweet) => tweet.replies));

    if (nestedReply == null) {
      return false;
    }
    nestedReply.replies.push(reply);
    nestedReply.numberOfReplies += 1;
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


