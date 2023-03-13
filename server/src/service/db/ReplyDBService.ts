import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { UserInterface } from "../../model/interfaces/user.interface";
import { ReplyServiceInterface } from "../interfaces/replyservice.interface";
import { makeUserDBService } from "./UserDBService";
import mongoose, { Model } from "mongoose";
import { UserServiceInterface } from "../interfaces/userservice.interface";
import { DatabaseModels } from "../../db/connect_database";




class ReplyDBService implements ReplyServiceInterface {
    
    userDBService : UserServiceInterface;
    replyModel : Model<ReplyInterface, {}, {}, {}, any>;

    constructor(replyModel: Model<ReplyInterface, {}, {}, {}, any> ,userDBService : UserServiceInterface){
        this.replyModel = replyModel;
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
}


export function makeReplyDBService(dataBaseModels : DatabaseModels) : ReplyServiceInterface{
  const replyModel = dataBaseModels.getReplyModel();

  const userDBService = makeUserDBService(dataBaseModels);
  return new ReplyDBService(replyModel, userDBService);
}