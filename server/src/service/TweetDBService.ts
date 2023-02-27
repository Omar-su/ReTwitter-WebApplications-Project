import { tweetModel } from "../db/tweet";
import { Tweet } from "../model/tweet";
import { User } from "../model/profile";
import { userDBService } from "./UserDBService";
import { Reply } from "../model/reply";

class TweetDBService {


  async createTweet(author: User, description: string): Promise<Tweet> {
    const newTweet = new tweetModel({
      id: Date.now().valueOf(),
      author: author,
      description: description,
      numberOfReplies: 0,
      numberOfLikes: 0,
      replies: []
    });
    await newTweet.save();
    author.tweets.push(newTweet);
    await userDBService.updateUser(author);
    return newTweet;
  }

  // No nested reply update. How would that work here? 
  async likeTweet(tweetAuthor: User, id: number): Promise<boolean> {
    const tweet: Tweet | undefined = tweetAuthor.tweets.find((tweet: Tweet) => {
      return tweet.id === id;
    });

    if (tweet != null) {
      tweet.numberOfLikes += 1;
      await tweetModel.findOneAndUpdate({ id: tweet.id }, tweet, { new: true });
      await userDBService.updateUser(tweetAuthor);
      return true;
    }

    const nestedReply: Reply | undefined = this.recrusiveIdSearch(id, tweetAuthor.tweets.flatMap((tweet) => tweet.replies));

    if (nestedReply == null) {
      return false;
    }
    nestedReply.numberOfLikes += 1;
    // await replyDBService.updateReply(nestedReply)?
    await userDBService.updateUser(tweetAuthor);
    return true;
  }

  // Search for a reply with an id recrusivaly 
  recrusiveIdSearch(id: number, replyToBeSearched: Reply[]): Reply | undefined {
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

  async deleteTweet(tweetAuthor: User, id: number): Promise<boolean> {
    // Find the index of the tweet to remove in the user's tweets array
    const tweetIndex = tweetAuthor.tweets.findIndex((tweet: Tweet) => tweet.id === id);
  
    if (tweetIndex >= 0) {
      // Remove the tweet
      tweetAuthor.tweets.splice(tweetIndex, 1);
  
      await tweetModel.findOneAndDelete({ id });
      await userDBService.updateUser(tweetAuthor);
  
      return true;
    }
  
    return false;
  }



}