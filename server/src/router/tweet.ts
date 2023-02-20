import express, { Request, Response } from "express";
import { Tweet } from "../model/tweet";
import { makeTweetService } from "../service/tweet";
import { Reply } from "../model/reply";

export const tweetRouter = express.Router();

const tweetService = makeTweetService();

tweetRouter.get("/", async (
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


tweetRouter.post("/", async( 
    req: Request<{}, {}, {author:string, description : string}>,
    res: Response<Tweet | string>
) => {
    try {
        const author = req.body.author;
        const description = req.body.description;
    
        if (typeof(description) !== "string" || typeof(author) !== "string") {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type
            ${typeof(description)}`);
            return;
        }
        const newTweet = await tweetService.tweet(author, description);
        res.status(201).send(newTweet);
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});



tweetRouter.post("/:id", async(
    req : Request<{id : string}, {}, {} >,
    res : Response<string>
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
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


// TODO THIS IS FOR TESTING
tweetRouter.post("/reply/:id",
    async(
    req : Request<{id : string},{},{ author : string, description : string, origowner : string}>,
    res : Response<string>
    )=>{
    try {
        const author = req.body.author;
        const desc = req.body.description;
        const origowner = req.body.origowner;

        if(typeof(desc) !== "string" || typeof(author) !== "string" || typeof(origowner)!== "string" ){
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing body data`);
            return;
        }
        
        if (req.params.id == null) {
            res.status(400).send("Id not found");
            return;
        }
        const id : number = parseInt(req.params.id, 10);
        // const id : number = req.body.id;
        if (! (id > 0)) {
            res.status(400).send("Not found id");
            return;
        }

        const succeeded = await tweetService.replyOnTweet(id , author, desc, origowner);

        
        if (! succeeded) {
            res.status(404).send("does not work");
            return;
        }
        res.status(200).send("succeeded");
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});