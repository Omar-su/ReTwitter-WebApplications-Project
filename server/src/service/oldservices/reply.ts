import { User } from "../model/profile";
import { Reply } from "../model/reply"

class ReplyService{

  async reply(author : User, description : string, ownerOfTweet : string) : Promise<Reply>{
    const newReply = new Reply(author, description, ownerOfTweet)
    return newReply;
  }

}

export function makeReplyService() : ReplyService{
  return new ReplyService;
}