import { makeUserDBService } from "./UserDBService";
import { TweetInterface } from "../../model/interfaces/tweet.interface";
import { makeReplyDBService } from "./ReplyDBService";
import { TweetServiceInterface } from "../interfaces/tweetservice.interface";
import { UserInterface } from "../../model/interfaces/user.interface";
import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { Model } from "mongoose";
import { UserServiceInterface } from "../interfaces/userservice.interface";
import { ReplyServiceInterface } from "../interfaces/replyservice.interface";
import { DatabaseModels } from "../../db/connect_database";



class TweetDBService implements TweetServiceInterface{

  
  userDBService : UserServiceInterface;
  replyDBService : ReplyServiceInterface;
  tweetModel : Model<TweetInterface, {}, {}, {}, any>;
  replyModel : Model<ReplyInterface, {}, {}, {}, any>;
  userModel : Model<UserInterface, {}, {}, {}, any>;
  
  
  constructor(tweetModel: Model<TweetInterface, {}, {}, {}, any>, replyModel: Model<ReplyInterface, {}, {}, {}, any>, userModel: Model<UserInterface, {}, {}, {}, any>, userDBService : UserServiceInterface, replyDBService : ReplyServiceInterface){
    this.replyModel = replyModel;
    this.tweetModel = tweetModel;
    this.userModel = userModel;
    this.userDBService = userDBService;
    this.replyDBService = replyDBService;
  }
  
  async getTweets() : Promise<TweetInterface[]> {
    return await tweetModel.find();
  }

  async createTweet(author: string, description: string): Promise<TweetInterface> {
    const newTweet = new this.tweetModel({
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
    const authorToUpdate = await this.userDBService.findUserByUsername(author);
    if(authorToUpdate) {
      authorToUpdate.tweets.push(newTweet);
      await this.userDBService.updateUser(authorToUpdate);
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

  private async likeTweet(tweet: TweetInterface, foundUser: UserInterface) {
    tweet.usersThatLikedTheTweet.push(foundUser.userNameID);
    tweet.numberOfLikes += 1;
    await this.updateTweet(tweet);
    return true;
  }

  private async unLikeTweet(tweet: TweetInterface, foundUser: UserInterface) {
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
    const reply = await this.replyDBService.createReply(foundUser.ownerName, desc, tweet.author);
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
    const reply = await this.replyDBService.createReply(foundUser.ownerName, desc, nestedReply.author);
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
    const updatedTweet = await this.tweetModel.findByIdAndUpdate(tweet._id.toString(), tweet, { new: true });
    return updatedTweet;
  }

  async updateReply(reply: ReplyInterface): Promise<ReplyInterface | null> {
    const updatedReply = await this.replyModel.findByIdAndUpdate(reply._id.toString(), reply, { new: true });
    return updatedReply;
  }

  async findUserByID(user_id: string): Promise<UserInterface | null> {
    return await this.userModel.findById(user_id).populate("tweets");
  }

  async findTweetByID(tweet_id: string): Promise<TweetInterface | null> {
    return await this.tweetModel.findById(tweet_id);
  }
  async findTweetByDateID(dateID: number): Promise<TweetInterface | null> {
    return await this.tweetModel.findOne({ "id": dateID }).populate("replies");
  }
  async findReplyByDateID(dateID: number): Promise<ReplyInterface | null> {
    return await this.replyModel.findOne({ "id": dateID }).populate("replies");
  }

  async deleteTweet(tweetAuthor: UserInterface, id: number): Promise<boolean> {
    const foundUser = await this.findUserByID(tweetAuthor._id.toString());
    if (!foundUser) {
      return false;
    }
    
    if ( await this.tweetModel.findOneAndDelete({id : id, author: tweetAuthor.userNameID }) ) {
      return true;
    }
  
    return false;
  }
}
export function makeTweetDBService( dataBaseModels : DatabaseModels ) : TweetServiceInterface {  
  const tweetModel = dataBaseModels.getTweetModel();
  const replyModel = dataBaseModels.getReplyModel();
  const userModel = dataBaseModels.getUserModel();

  const userDBService = makeUserDBService(dataBaseModels);
  const replyDBService = makeReplyDBService(dataBaseModels);

  return new TweetDBService(tweetModel, replyModel, userModel, userDBService, replyDBService);
}