import express, {Request, Response } from "express"
import { makeReplyDBService } from "../service/db/ReplyDBService";
import { UserInterface } from "../model/interfaces/user.interface";
import { ReplyInterface } from "../model/interfaces/reply.interface";
import { ReplyServiceInterface } from "../service/interfaces/replyservice.interface";
import { databasemodels } from "./user";
import { makeTweetDBService } from "../service/db/TweetDBService";
import { TweetServiceInterface } from "../service/interfaces/tweetservice.interface";

export const replyRouter = express.Router();
const tweetService: TweetServiceInterface = makeTweetDBService(databasemodels);
const replyService: ReplyServiceInterface = makeReplyDBService(databasemodels);

replyRouter.post("/",

// TODO author should be logged in user
async(
  req : Request<{},{},{author : string, desc : string, origowner : string}>,
  res : Response<ReplyInterface>
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

type GetRepliesRequest = Request & {
  params: {
      id?: string;
  };
  session: {
      user?: UserInterface;
  }
}

/**
 * A get call which returns all replies to a specific tweet
 */
replyRouter.get("/feed/replies/:id", async (req: GetRepliesRequest, res: Response<ReplyInterface[] | string>) => {
  try {
      if (req.session.user == null) {
          res.status(401).send("Not logged in");
          return;
      }
      if (req.params.id == null) {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
          return;
      }
      const id: number = parseInt(req.params.id, 10);
      if (!(id > 0)) {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
          return;
      }
      const replies = await replyService.getRepliesOnTweet(id);
      if (replies == null) {
          res.status(500).send("Failed to get feed tweets");
          return;
      }
      res.status(200).send(replies);
  } catch (e: any) {
      res.status(500).send(e.message);
  }
});



type ReplyRequest = Request & {
  params: { id: string };
  body: { author: string, description: string };
  session: { user?: UserInterface };

}

/**
 * A post call to comment on a specific tweet
 */
replyRouter.post("/:id",
    async (
        req: ReplyRequest,
        res: Response<string>
    ) => {
        try {
            const desc = req.body.description;

            if (typeof (desc) !== "string") {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing body data`);
                return;
            }

            if (req.params.id == null) {
                res.status(400).send("Id not found");
                return;
            }
            const id: number = parseInt(req.params.id, 10);
            // const id : number = req.body.id;
            if (!(id > 0)) {
                res.status(400).send("Id not found");
                return;
            }

            if (req.session.user == null) {
                res.status(401).send("Not logged in");
                return;
            }
            const succeeded = await tweetService.replyOnTweetOrReply(req.session.user, id, desc);

            if (!succeeded) {
                res.status(404).send("Tweet not found");
                return;
            }
            res.status(200).send("Succeeded");
        } catch (e: any) {
            res.status(500).send(e.message);
        }

});





