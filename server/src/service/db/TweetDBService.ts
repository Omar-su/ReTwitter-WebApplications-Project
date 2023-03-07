import { tweetModel } from "../../db/tweet";
import { makeUserDBService } from "./UserDBService";
import { Reply } from "../../model/reply";
import { UserInterface } from "../../model/interfaces/user.interface";
import { TweetInterface } from "../../model/interfaces/tweet.interface";

export const userDBService = makeUserDBService();

class TweetDBService {
  
  async createTweet(author: string, description: string): Promise<TweetInterface> {
    const newTweet = new tweetModel({
      id: Date.now().valueOf(),
      author: author,
      description: description,
      numberOfReplies: 0,
      numberOfLikes: 0,
      replies: []
    });
    console.log(author);
    await newTweet.save();
    const authorToUpdate = await userDBService.findUserByUsername(author);
    if(authorToUpdate) {
      authorToUpdate.tweets.push(newTweet);
      await userDBService.updateUser(authorToUpdate);
    }
    return newTweet;
  }

  // No nested reply update. How would that work here? 
  async likeTweet(tweetAuthor: UserInterface, id: number): Promise<boolean> {
    const tweet: TweetInterface | undefined = tweetAuthor.tweets.find((tweet: TweetInterface) => {
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

  async deleteTweet(tweetAuthor: UserInterface, id: number): Promise<boolean> {
    // Find the index of the tweet to remove in the user's tweets array
    const tweetIndex = tweetAuthor.tweets.findIndex((tweet: TweetInterface) => tweet.id === id);

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
export function makeTweetDBService() {
  return new TweetDBService;
}