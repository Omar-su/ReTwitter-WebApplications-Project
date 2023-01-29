import { Tweet } from "../model/tweet";
import { Comment } from "../model/comment";

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

export function commentOnTweet(id : number, comment : Comment) : boolean{
  const tweet : Tweet | undefined = tweets.find((tweet : Tweet) => {
    return tweet.id === id;
  }); 
  if (tweet == null) {
    return false;
  }
  tweet.addComment(comment);
  return true;
}




