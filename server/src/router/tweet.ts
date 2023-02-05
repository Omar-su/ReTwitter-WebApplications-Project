import express, { Request, Response } from "express";
import { Tweet } from "../model/tweet";
import { makeTweetService } from "../service/tweet";

export const tweetRouter = express.Router();

const tweetService = makeTweetService();

tweetRouter.get("/tweet", async (
    req: Request<{}, {}, {}>,
    res: Response<Array<Tweet> | String>
) => {
    try {
        const tweets = await tweetService.getTweets();
        res.status(200).send(tweets);
    } catch (e:any) {
        res.status(500).send(e.message);
    }
});


tweetRouter.post("/tweet", async( 
    req: Request<{}, {}, {author:string, description : string}>,
    res: Response<Tweet | string>
) => {
    try {
        const author = req.body.author;
        const description = req.body.description;
        console.log(author + description)
    
        if (typeof(description) !== "string" || typeof(author) !== "string") {
            res.status(400).send(`Bad POST cass to ${req.originalUrl} --- description has type
            ${typeof(description)}`);
            return;
        }
        const newTweet = await tweetService.tweet(author, description);
        res.status(201).send(newTweet);
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});



tweetRouter.post("/tweet/:id", async(
    req : Request<{id : string}, {}, {} >,
    res : Response<string>
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Bad PUT call to ${req.originalUrl} --- missing id param`);
            return;
        }
        const id : number = parseInt(req.params.id, 10);
        if (! (id > 0)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
            return;
        }

        const succeeded = await tweetService.likeTweet(id);
        
        if (! succeeded) {
            res.status(404).send(`No tweet with id number ${id}`);
            return;
        }

        res.status(200).send("tweet number of likes increased");
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});