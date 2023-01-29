import { Tweet } from "../model/tweet";
import { Reply } from "../model/reply";

const tweets : Tweet[] = [];

export function getTweets() : Tweet[] {
  return tweets;
}

export function tweet(author : string, description : string) : Tweet {
  const newTweet = new Tweet(author, description);
  tweets.push(newTweet);
  return newTweet;
}



export function likeTweet(id : number) : boolean{
    const tweet : Tweet | undefined = tweets.find((tweet : Tweet) => {
      return tweet.id === id;
    }); 
    if (tweet == null) {
      return false;
    }
    tweet.increaseNrLikes();
    return true;
}

export function commentOnTweet(id : number, reply : Reply) : boolean{
  const tweet : Tweet | undefined = tweets.find((tweet : Tweet) => {
    return tweet.id === id;
  }); 
  if (tweet == null) {
    return false;
  }
  tweet.addReply(reply);
  return true;
}




