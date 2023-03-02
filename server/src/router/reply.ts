import express, {Request, Response } from "express"
import { User } from "../model/profile";
import { Reply } from "../model/reply";
import { makeReplyDBService } from "../service/db/ReplyDBService";
import { makeReplyService } from "../service/reply";

export const replyRouter = express.Router();

const replyService = makeReplyDBService();

replyRouter.post("/tweet/reply",

// TODO author should be logged in user
async(
  req : Request<{},{},{author : User, desc : string, origowner : string}>,
  res : Response<Reply>
)=>{
  try {
    const author = req.body.author;
    const desc = req.body.desc;
    const origowner = req.body.origowner;
    
    const newReply = await replyService.createReply(author, desc, origowner);
    res.status(201).send(newReply);
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});






