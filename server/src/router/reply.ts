import express, {Request, Response } from "express"
import { Reply } from "../model/reply";
import { makeReplyService } from "../service/reply";

export const replyRouter = express.Router();

const replyService = makeReplyService();

replyRouter.post("/tweet/reply",
async(
  req : Request<{},{},{author : string, desc : string, origowner : string}>,
  res : Response<Reply>
)=>{
  try {
    const author = req.body.author;
    const desc = req.body.desc;
    const origowner = req.body.origowner;
    
    const newReply = await replyService.reply(author, desc, origowner);
    res.status(201).send(newReply);
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});






