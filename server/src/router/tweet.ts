import express from "express";
import { makeTweetService } from "../service/tweet";

export const tweetRouter = express.Router();

const tweetService = makeTweetService();

tweetRouter.get("/tweet", (req, res) => {
    res.status(200).send(tweetService.getTweets());
});


tweetRouter.post("/tweet", (req, res) => {
    const author = req.body.author;
    const description = req.body.description;
    console.log(author + description)

    if (typeof(description) !== "string" || typeof(author) !== "string") {
        res.status(400).send(`Bad POST cass to ${req.originalUrl} --- description has type
        ${typeof(description)}`);
        return;
    }
    const newTweet = tweetService.tweet(author, description);
    res.status(201).send(newTweet);
});



tweetRouter.post("/tweet/:id", (req, res) => {
  const id : number = parseInt(req.params.id, 10);
  if (! (id > 0)) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
      return;
  }


  const succeeded = tweetService.likeTweet(id);
  
  if (! succeeded) {
      res.status(404).send(`No tweet with id number ${id}`);
      return;
  }

  res.status(200).send("tweet number of likes increased");
});