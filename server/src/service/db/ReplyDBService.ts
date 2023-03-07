import { replyModel } from "../../db/reply";
import { ReplyInterface } from "../../model/interfaces/reply.interface";
import { UserInterface } from "../../model/interfaces/user.interface";
import { ReplyServiceInterface } from "../interfaces/replyservice.interface";
import { makeUserDBService } from "./UserDBService";
import mongoose from "mongoose";


export const userDBService = makeUserDBService();

class ReplyDBService implements ReplyServiceInterface {

    async createReply(author : string, description : string, ownerOfTweet : string): Promise<ReplyInterface> {

    const newReply = new replyModel({
      id: Date.now().valueOf(),
      author: author,
      userNameOfOriginalTweet: ownerOfTweet,
      description: description,
      numberofreplies: 0,
      numberoflikes: 0,
      replies: []
    });
    await newReply.save();
    //author.tweets.push(newReply);
    //await userDBService.updateUser(author);
    return newReply;
  }
}
export function makeReplyDBService() {
  return new ReplyDBService;
}