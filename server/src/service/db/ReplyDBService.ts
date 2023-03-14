import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { UserInterface } from "../../model/interfaces/user.interface";
import { ReplyServiceInterface } from "../interfaces/replyservice.interface";
import { makeUserDBService } from "./UserDBService";
import mongoose, { Model } from "mongoose";
import { UserServiceInterface } from "../interfaces/userservice.interface";
import { DatabaseModels } from "../../db/connect_database";
import { TweetInterface } from "../../model/interfaces/tweet.interface";




class ReplyDBService implements ReplyServiceInterface {
    
    userDBService : UserServiceInterface;
    replyModel : Model<ReplyInterface, {}, {}, {}, any>;
    tweetModel : Model<TweetInterface, {}, {}, {}, any>;

    constructor(replyModel: Model<ReplyInterface, {}, {}, {}, any>, tweetModel : Model<TweetInterface, {}, {}, {}, any> ,userDBService : UserServiceInterface){
        this.replyModel = replyModel;
        this.tweetModel = tweetModel;
        this.userDBService = userDBService;
    }

    async createReply(author : string, description : string, ownerOfTweet : string): Promise<ReplyInterface> {

    const newReply = new this.replyModel({
      id: Date.now().valueOf(),
      author: author,
      userNameOfOriginalTweet: ownerOfTweet,
      description: description,
      numberOfReplies: 0,
      numberOfLikes: 0,
      usersThatLikedTheTweet : [],
      replies: []
    });
    await newReply.save();
    //author.tweets.push(newReply);
    //await userDBService.updateUser(author);
    return newReply;
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


  async replyOnReply(foundUser : UserInterface, id : number, desc : string) : Promise<boolean>{
    const nestedReply : ReplyInterface | null = await this.findReplyByDateID(id);
    if (nestedReply == null) {
      return false;
    }
    const reply = await this.createReply(foundUser.userNameID, desc, nestedReply.author);
    nestedReply.replies.push(reply._id);
    nestedReply.numberOfReplies += 1;
    await this.updateReply(nestedReply);
    return true;
  }

  async getRepliesOnTweet(id : number) : Promise<ReplyInterface[] | null> {
    const foundTweet = await this.findTweetByDateID(id);
    if (foundTweet) {
        return foundTweet.replies;
    }
    const foundReply = await this.findReplyByDateID(id);
    if (foundReply) {
      return foundReply.replies;
    }
    return null;
  }

  async updateReply(reply: ReplyInterface): Promise<ReplyInterface | null> {
    const updatedReply = await this.replyModel.findByIdAndUpdate(reply._id.toString(), reply, { new: true });
    return updatedReply;
  }

  async findReplyByDateID(dateID: number): Promise<ReplyInterface | null> {
    return await this.replyModel.findOne({ "id": dateID }).populate("replies");
  }

  async findTweetByID(tweet_id: string): Promise<TweetInterface | null> {
    return await this.tweetModel.findById(tweet_id);
  }

  async findTweetByDateID(dateID: number): Promise<TweetInterface | null> {
    return await this.tweetModel.findOne({ "id": dateID }).populate("replies");
  }

}


export function makeReplyDBService(dataBaseModels : DatabaseModels) : ReplyServiceInterface{
  const replyModel = dataBaseModels.getReplyModel();
  const tweetModel = dataBaseModels.getTweetModel();

  const userDBService = makeUserDBService(dataBaseModels);
  return new ReplyDBService(replyModel, tweetModel , userDBService);
}