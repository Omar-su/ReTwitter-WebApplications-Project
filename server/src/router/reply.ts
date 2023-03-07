import express, {Request, Response } from "express"
import { Reply } from "../model/reply";
import { makeReplyDBService } from "../service/db/ReplyDBService";
import { UserInterface } from "../model/interfaces/user.interface";

export const replyRouter = express.Router();

const replyService = makeReplyDBService();

replyRouter.post("/tweet/reply",

// TODO author should be logged in user
async(
  req : Request<{},{},{author : UserInterface, desc : string, origowner : string}>,
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






