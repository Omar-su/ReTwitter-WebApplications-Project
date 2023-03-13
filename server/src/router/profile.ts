import express, { Request, Response } from "express";
import { connUrlOrigin } from "../db/conn_url_origin";
import { UserInterface } from "../model/interfaces/user.interface";
import { makeUserDBService } from "../service/db/UserDBService";
import { UserServiceInterface } from "../service/interfaces/userservice.interface";
import { databasemodels } from "./user";

export const profileRouter = express.Router();
const userService: UserServiceInterface = makeUserDBService(databasemodels);

profileRouter.get("/:username", async (
  req: Request<{ username: string }, {}, {}>,
  res: Response<UserInterface | string>
) => {
  try {
    const userName: string = req.params.username;

    if (userName == null) {
      res.status(400).send(`Bad GET call to ${req.originalUrl} --- missing username param`);
      return;
    }

    const user = await userService.findUserByUsername(userName);
    if (user == null) {
      res.status(404).send(`No user exists with username ${userName}`);
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
    username: string;
  };
  session: {
    user?: UserInterface;
  };
}

profileRouter.post("/:username/follow", async (
  req: followRequest,
  res: Response<string>
) => {
  try {
    const followeeUserName = req.params.username;
    if (followeeUserName == null) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing account to follow`);
      return;
    }
    if (typeof (followeeUserName) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- account to follow has type 
        ${typeof (followeeUserName)}`);
      return;
    }
    if (req.session.user == null) {
      res.status(401).send("Not logged in");
      return;
    }
    const userFollowingUserName: string = req.session.user.userNameID;
    const succeeded = await userService.followProfile(followeeUserName, userFollowingUserName);

    if (!succeeded) {
      res.status(404).send(`No user with username ${followeeUserName} 
          or no user with username ${userFollowingUserName}`);
      return;
    }

    res.status(200).send("Added users to follower and following list");
  } catch (e: any) {
    res.status(500).send(e.message);
  }

});

type unFollowRequest = Request & {
  params: {
    username: string;
  };
  session: {
    user?: UserInterface;
  };
}

profileRouter.post("/:username/unfollow", async (
  req: unFollowRequest,
  res: Response<string>
) => {
  try {
    const toBeUnfollowedUserName = req.params.username;
    if (toBeUnfollowedUserName == null) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing account to unfollow`);
      return;
    }
    if (typeof (toBeUnfollowedUserName) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- account to unfollow has type 
        ${typeof (toBeUnfollowedUserName)}`);
      return;
    }
    if (req.session.user == null) {
      res.status(401).send("Not logged in");
      return;
    }

    const userUnfollowingUsername: string = req.session.user.userNameID;
    const succeeded = await userService.unfollowProfile(toBeUnfollowedUserName, userUnfollowingUsername);

    if (!succeeded) {
      res.status(404).send(`No user with username ${toBeUnfollowedUserName} 
          or no user with username ${userUnfollowingUsername}`);
      return;
    }

    res.status(200).send("Removed users from follower and following list");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});












