import { Reply } from "../model/reply"

class ReplyService{

  async reply(author : string, description : string, ownerOfTweet : string) : Promise<Reply>{
    const newReply = new Reply(author, description, ownerOfTweet)
    return newReply;
  }

}

export function makeReplyService() : ReplyService{
  return new ReplyService;
}