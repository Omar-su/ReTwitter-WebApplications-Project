import { tweetModel } from "../../db/tweet";
import { makeUserDBService } from "./UserDBService";
import { userModel } from "../../db/user";
import { TweetInterface } from "../../model/interfaces/tweet.interface";
import { makeReplyDBService } from "./ReplyDBService";
import { TweetServiceInterface } from "../interfaces/tweetservice.interface";
import { UserInterface } from "../../model/interfaces/user.interface";
import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { Tweet } from "../../model/tweet";
import { User } from "../../model/user";
import { replyModel } from "../../db/reply";

export const userDBService = makeUserDBService();
const replyDBService = makeReplyDBService();

class TweetDBService implements TweetServiceInterface{
  
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

    if (tweet == null) {
      return false;
    }

    const nestedReply: ReplyInterface | undefined = this.recrusiveIdSearch(id, tweetAuthor.tweets.flatMap((tweet) => tweet.replies));

    if (nestedReply == null) {
      return false;
    }
    nestedReply.numberOfLikes += 1;
    // await replyDBService.updateReply(nestedReply)?
    await userDBService.updateUser(tweetAuthor);
    return true;
  }

  // Search for a reply with an id recrusivaly 
  private recrusiveIdSearch(id: number, replyToBeSearched: ReplyInterface[]): ReplyInterface | undefined {
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

  async replyOnTweet(user: UserInterface, id: number, desc : string): Promise<boolean> {

    const foundUser = await this.findUserByID(user._id.toString());
    if (!foundUser) {
      return false;
    }
    console.log("test" , foundUser)

    // const tweet : TweetInterface | undefined = foundUser.tweets.find((tweet : TweetInterface) => {
    //   return tweet.id === id;
    // }); 
    const tweet : Tweet | TweetInterface = await this.findTweetByDateID(id);
    console.log("test" , tweet)

    if (tweet != null) {
      console.log("inside if stat" )
      const tweet2 = await this.findTweetByID(tweet._id.toString());
      if (!tweet2) {
        return false;
      }
      console.log("inside if stat", tweet2 );
      const reply = await replyDBService.createReply(foundUser.ownerName, desc, foundUser.ownerName);
      tweet2.replies.push(reply._id);
      console.log("test after change" , tweet2)
      tweet2.numberOfReplies += 1;
      const fu = await this.updateTweet(tweet2);
      console.log("test tweet fu " , fu)
      return true;
    }
    console.log("outside if stat" )

    //const nestedReply : ReplyInterface | undefined = this.recrusiveIdSearch(id, foundUser.tweets.flatMap((tweet) => tweet.replies));
    const nestedReply : ReplyInterface | undefined = await this.findReplyByDateID(id);
    console.log("outside if stat", nestedReply );

    if (nestedReply == null) {
      return false;
    }
    const reply = await replyDBService.createReply(foundUser.ownerName, desc, foundUser.ownerName);
    nestedReply.replies.push(reply);
    nestedReply.numberOfReplies += 1;
    await this.updateReply(nestedReply);
    return true;
  }

  async updateTweet(tweet: Tweet): Promise<Tweet | null> {
    const updatedTweet = await tweetModel.findByIdAndUpdate(tweet._id.toString(), tweet, { new: true });
    return updatedTweet;
  }
  async updateReply(reply: Reply): Promise<Reply | null> {
    const updatedReply = await replyModel.findByIdAndUpdate(reply._id.toString(), reply, { new: true });
    return updatedReply;
  }
  async findUserByID(user_id: string): Promise<User | null> {
    return await userModel.findById(user_id).populate("tweets");
  }

  async findTweetByID(tweet_id: string): Promise<Tweet | null> {
    return await tweetModel.findById(tweet_id);
  }
  async findTweetByDateID(dateID: number): Promise<TweetInterface | null> {
    return await tweetModel.findOne({ "id": dateID });
  }
  async findReplyByDateID(dateID: number): Promise<ReplyInterface | undefined> {
    return await replyModel.findOne({ "id": dateID });
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