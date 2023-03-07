import { replyModel } from "../../db/reply";
import { UserInterface } from "../../model/interfaces/user.interface";
import { Reply } from "../../model/reply";
import { makeUserDBService } from "./UserDBService";


export const userDBService = makeUserDBService();

class ReplyDBService {

    async createReply(author : UserInterface, description : string, ownerOfTweet : string): Promise<Reply> {
    const newReply = new replyModel({
      id: Date.now().valueOf(),
      author: author._id,
      userNameOfOriginalTweet: ownerOfTweet,
      description: description,
      numberOfReplies: 0,
      numberOfLikes: 0,
      replies: []
    });
    await newReply.save();
    author.tweets.push(newReply);
    await userDBService.updateUser(author);
    return newReply;
  }
}
export function makeReplyDBService() {
  return new ReplyDBService;
}