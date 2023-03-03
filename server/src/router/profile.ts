import express, { Request, Response } from "express";
import { User } from "../model/user";
import { makeUserDBService } from "../service/db/UserDBService";

export const profileRouter = express.Router();
const userService = makeUserDBService();

profileRouter.get("/:userid", async (
  req: Request<{ userid: string }, {}, {}>,
  res: Response<User | string>
) => {
  try {
    const userID: string = req.params.userid;

    if (userID == null) {
      res.status(400).send(`Bad GET call to ${req.originalUrl} --- missing user id param`);
      return;
    }

    const user = await userService.findUserByUsername(userID);
    if (user == null) {
      res.status(404).send(`No user exists with id number ${userID}`);
      return;
    }

    // if (user?.getTweets == null) {
    //   res.status(404).send(`no tweets from user with id number ${userID}`);
    //   return;
    // }
    
    res.status(200).send(user);

  } catch (e: any) {
    res.status(500).send(e.message);
  }

});

type followRequest = Request & {
  params: {
    toBeFollowedId: string;
  };
  session: {
    user?: User;
  };
}

profileRouter.post("/:toBeFollowedId/follow", async (
  req: followRequest,
  res: Response<string>
) => {
  try {
    const followee = req.params.toBeFollowedId;
    if (followee == null) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing account to follow`);
      return;
    }
    if (typeof (followee) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- account to follow has type 
        ${typeof (followee)}`);
      return;
    }
    if (req.session.user == null) {
      res.status(401).send("Not logged in");
      return;
    }
    console.log(req.session.user)
    const userFollowingId : string = req.session.user._id.toString();
    const succeeded = await userService.followProfile(followee, userFollowingId);

    if (!succeeded) {
      res.status(404).send(`No user with id ${followee} 
          or no user with id ${userFollowingId}`);
      return;
    }

    res.status(200).send("Added users to follower and following list");
  } catch (e: any) {
    res.status(500).send(e.message);
  }

});

type unFollowRequest = Request & {
  params: {
    toBeUnFollowedId: string;
  };
  session: {
    user?: User;
  };
}

profileRouter.post("/:toBeUnfollowedId/unfollow", async (
  req: unFollowRequest,
  res: Response<string>
) => {
  try {
    const toBeUnfollowedId = req.params.toBeUnfollowedId;
    if (toBeUnfollowedId == null) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing account to unfollow`);
      return;
    }
    if (typeof (toBeUnfollowedId) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- account to unfollow has type 
        ${typeof (toBeUnfollowedId)}`);
      return;
    }
    if (req.session.user == null) {
      res.status(401).send("Not logged in");
      return;
    }

    const userUnfollowingId : string = req.session.user._id.toString();
    const succeeded = await userService.unfollowProfile(toBeUnfollowedId, userUnfollowingId);

    if (!succeeded) {
      res.status(404).send(`No user with id ${toBeUnfollowedId} 
          or no user with id ${userUnfollowingId}`);
      return;
    }

    res.status(200).send("Removed users from follower and following list");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});












