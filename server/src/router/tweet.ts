import express from "express";
import { tweet, likeTweet, commentOnTweet, getTweets } from "../service/tweet";

export const tweetRouter = express.Router();

tweetRouter.get("/tweet", (req, res) => {
    res.status(200).send(getTweets());
});


tweetRouter.post("/tweet", (req, res) => {
    const author = req.body.author;
    const description = req.body.description;

    if (typeof(description) !== "string" || typeof(author) !== "string") {
        res.status(400).send(`Bad POST cass to ${req.originalUrl} --- description has type
        ${typeof(description)}`);
        return;
    }
    const newTweet = tweet(author, description);
    res.status(201).send(newTweet);
});



tweetRouter.post("/tweet/:id", (req, res) => {
  const id : number = parseInt(req.params.id, 10);
  if (! (id > 0)) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
      return;
  }


  const succeeded = likeTweet(id);
  
  if (! succeeded) {
      res.status(404).send(`No tweet with id number ${id}`);
      return;
  }

  res.status(200).send("tweet number of likes increased");
});