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
      usersThatLikedTheTweet : [],
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
  async likeOrUnlikeTweet(user: UserInterface, id: number): Promise<boolean> {
    const foundUser = await this.findUserByID(user._id.toString());
    if (!foundUser) {
      return false;
    }

    const tweet : null | TweetInterface = await this.findTweetByDateID(id);

    if (tweet != null) {
      if (tweet.usersThatLikedTheTweet.includes(foundUser.userNameID)) {
        return await this.unLikeTweet(tweet, foundUser);
      }
      return await this.likeTweet(tweet, foundUser);
    }
    return await this.likeOrUnlikeReply(foundUser, id);
  }

  private async likeTweet(tweet: TweetInterface, foundUser: User) {
    tweet.usersThatLikedTheTweet.push(foundUser.userNameID);
    tweet.numberOfLikes += 1;
    await this.updateTweet(tweet);
    return true;
  }

  private async unLikeTweet(tweet: TweetInterface, foundUser: User) {
    tweet.numberOfLikes -= 1;
    tweet.usersThatLikedTheTweet = tweet.usersThatLikedTheTweet.filter((str) => str !== foundUser.userNameID);
    await this.updateTweet(tweet);
    return true;
  }

  async likeOrUnlikeReply(foundUser : UserInterface, id : number) : Promise<boolean> {
    const nestedReply : ReplyInterface | null = await this.findReplyByDateID(id);

    if (nestedReply == null) {
      return false;
    }
    if (nestedReply.usersThatLikedTheTweet.includes(foundUser.userNameID)) {
      return await this.unLikeReply(nestedReply, foundUser);
    }
    return await this.likeReply(nestedReply, foundUser);
  }


  private async likeReply(nestedReply: ReplyInterface, foundUser: UserInterface) {
    nestedReply.usersThatLikedTheTweet.push(foundUser.userNameID);
    nestedReply.numberOfLikes += 1;
    await this.updateReply(nestedReply);
    return true;
  }

  private async unLikeReply(nestedReply: ReplyInterface, foundUser: UserInterface) {
    nestedReply.numberOfLikes -= 1;
    nestedReply.usersThatLikedTheTweet = nestedReply.usersThatLikedTheTweet.filter((str) => str !== foundUser.userNameID);
    await this.updateReply(nestedReply);
    return true;
  }

  async replyOnTweetOrReply(user: UserInterface, id: number, desc : string): Promise<boolean> {

    const foundUser = await this.findUserByID(user._id.toString());
    if (!foundUser) {
      return false;
    }

    const tweet : null | TweetInterface = await this.findTweetByDateID(id);

    if (tweet != null) {
      return await this.replyOnTweet(tweet, foundUser, desc);
    }
    return await this.replyOnReply(foundUser, id, desc);
  }

  async replyOnTweet(tweet : TweetInterface, foundUser : UserInterface, desc : string) : Promise<boolean> {
    const tweet2 = await this.findTweetByID(tweet._id.toString());
    if (!tweet2) {
      return false;
    }
    const reply = await replyDBService.createReply(foundUser.ownerName, desc, tweet.author);
    tweet2.replies.push(reply._id);
    tweet2.numberOfReplies += 1;
    await this.updateTweet(tweet2);
    return true;
  }

  async replyOnReply(foundUser : UserInterface, id : number, desc : string) : Promise<boolean>{
    const nestedReply : ReplyInterface | null = await this.findReplyByDateID(id);
    if (nestedReply == null) {
      return false;
    }
    const reply = await replyDBService.createReply(foundUser.ownerName, desc, nestedReply.author);
    nestedReply.replies.push(reply._id);
    nestedReply.numberOfReplies += 1;
    await this.updateReply(nestedReply);
    return true;
  }

  async getRepliesOnTweet(id : number) : Promise<ReplyInterface[] | null> {
    const foundTweet = await this.findTweetByDateID(id);
    if (foundTweet) {
        //TODO Somehow use foundUser.getTweets(); 
        return foundTweet.replies;
    }
    const foundReply = await this.findReplyByDateID(id);
    if (foundReply) {
      //TODO Somehow use foundUser.getTweets(); 
      return foundReply.replies;
    }
    return null;
  }

  async updateTweet(tweet: TweetInterface): Promise<TweetInterface | null> {
    const updatedTweet = await tweetModel.findByIdAndUpdate(tweet._id.toString(), tweet, { new: true });
    return updatedTweet;
  }

  async updateReply(reply: ReplyInterface): Promise<ReplyInterface | null> {
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
    return await tweetModel.findOne({ "id": dateID }).populate("replies");
  }
  async findReplyByDateID(dateID: number): Promise<ReplyInterface | null> {
    return await replyModel.findOne({ "id": dateID }).populate("replies");
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