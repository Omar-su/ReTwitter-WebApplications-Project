import express, { Request, Response } from "express";
import { User } from "../model/profile";
import { makeProfileService } from "../service/profile";
import { Tweet } from "../model/tweet";

export const profileRouter = express.Router();

const profileService = makeProfileService();


profileRouter.get("/profile/:userid", async(
    req : Request<{},{},{userID : string}>,
    res : Response<Array<Tweet> | string>
) => {
  try {
    if(req.body.userID == null){
      res.status(400).send(`Bad GET call to ${req.originalUrl} --- missing user id param`);
      return;
    }

    const tweets = await profileService.getTweets(req.body.userID);
    if(tweets == null){
      res.status(404).send(`no user with id number ${req.body.userID}`);
      return;
    }

    res.status(200).send(tweets);

  } catch (e:any) {
    res.status(500).send(e.message);
  }

});

profileRouter.post("/newuser", async(
  req: Request<{}, {}, {userID : string, ownerName : string, bio : string}>,
  res: Response<User | string>
) => {
    try {
      const ownerName = req.body.ownerName;
      const bio = req.body.bio;
      
      if (typeof(ownerName) !== "string") {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- ownerName has type
          ${typeof(ownerName)}`);
          return;
      }else if( typeof(bio) !== "string"){
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- bio has type
          ${typeof(bio)}`);
          return;
      }
      const newUser = await profileService.createUser(req.body.userID, ownerName, bio);
      res.status(201).send(newUser);
      
    } catch (e:any) {
      res.status(500).send(e.message);
    }
});


profileRouter.post("/profile/tweet/:userid", async( 
  req: Request<{}, {}, {userID : string, description : string}>,
  res: Response<Tweet | string>
) => {
  try {
      const author = req.body.userID;
      const description = req.body.description;
  
      if (typeof(description) !== "string") {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type
          ${typeof(description)}`);
          return;
      }else if( typeof(author) !== "string"){
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- author has type
          ${typeof(author)}`);
          return;
      }
      const succeeded = await profileService.tweet(author, description);
      if (! succeeded) {
        res.status(404).send(`No user with id number ${author}`);
        return;
    }
      res.status(201).send("Tweet is tweeted");
  } catch (e:any) {
      res.status(500).send(e.message);
  }

});

profileRouter.post("/profile/:userName/follow", async(
  req : Request<{}, {}, {userName : string} >,
  res : Response<string>
) => {
  try {
      if (req.body.userName == null) {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
          return;
      }
      const userName = req.body.userName;
      if (typeof(userName) !== "string") {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- userID has type 
          ${typeof(userName)}`);
          return;
      }

      const succeeded = await profileService.followProfile(userName);
      
      if (! succeeded) {
          res.status(404).send(`No user with id ${userName}`);
          return;
      }

      res.status(200).send("number of followers increased");
  } catch (e:any) {
      res.status(500).send(e.message);
  }

});











