import express, { Request, Response } from "express";
import { User } from "../model/profile";
import { makeProfileService } from "../service/profile";
import { Tweet } from "../model/tweet";

export const profileRouter = express.Router();

export const profileService = makeProfileService();

profileRouter.get("/profiles", async (
  req: Request<{}, {}, {}>,
  res: Response<Array<User> | String>
) => {
  try {
      const users = await profileService.getProfiles();
      res.status(200).send(users);
  } catch (e:any) {
      res.status(500).send(e.message);
  }
});

profileRouter.get("/:userid", async(
    req : Request<{userid : string},{},{}>,
    res : Response<User | string>
) => {
  try {
    const userID : string = req.params.userid;
    
    if(userID == null){
      res.status(400).send(`Bad GET call to ${req.originalUrl} --- missing user id param`);
      return;
    }
    
    const user = await profileService.getProfile(userID);
    if(user == null) {
      res.status(404).send(`No user exists with id number ${userID}`);
      return;
    }
    
    if(user?.getTweets == null){
      res.status(404).send(`no tweets from user with id number ${userID}`);
      return;
    }
    res.status(200).send(user);

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


profileRouter.post("/tweet/:userid", async( 
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

// TODO CHECK FOLLOWER FIRST
profileRouter.post("/:userName/follow", async(
  req : Request<{userName : string}, {}, {follower : string} >,
  res : Response<string>
) => {
  try {
    const followee = req.params.userName;
      if (followee == null) {
          res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing account to follow`);
          return;
      }
      if (typeof(followee) !== "string") {
        res.status(400).send(`Bad POST call to ${req.originalUrl} --- account to follow has type 
        ${typeof(followee)}`);
        return;
    }
    const follower = req.body.follower;
    if (typeof(follower) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- account trying to follow has type 
      ${typeof(follower)}`);
      return;
  }

      const succeeded = await profileService.followProfile(followee, follower);
      
      if (! succeeded) {
          res.status(404).send(`No user with id ${followee} 
          or no user with id ${follower}`);
          return;
      }

      res.status(200).send("number of followers and following increased");
  } catch (e:any) {
      res.status(500).send(e.message);
  }

});











