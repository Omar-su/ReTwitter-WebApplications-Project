import express, { Request, Response } from "express";
import { UserInterface } from "../model/interfaces/user.interface";
import { User } from "../model/user";
import { makeUserDBService } from "../service/db/UserDBService";
import { UserServiceInterface } from "../service/interfaces/userservice.interface";

export const userRouter = express.Router();

export const userService: UserServiceInterface = makeUserDBService();

type UserRequest = Request & {
  body: {
    userid?: string;
    ownerName?: string;
    bio: string;
    email: string;
    password: string;
  }
  session: {
    user?: UserInterface;
  }
}

userRouter.post("/", async (
  req: UserRequest,
  res: Response<string>
) => {
  try {
    const userid: string = req.body.userid;
    const ownerName: string = req.body.ownerName;
    const bio: string = req.body.bio;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (typeof (userid) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- userid has type
      ${typeof (userid)}`);
      return;
    }
    if (typeof (bio) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- bio has type
      ${typeof (bio)}`);
      return;
    }
    if (typeof (ownerName) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- ownername has type
      ${typeof (ownerName)}`);
      return;
    }
    if (typeof (email) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- email has type
      ${typeof (email)}`);
      return;
    }
    if (typeof (password) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- passWord has type
      ${typeof (password)}`);
      return;
    }

    const succeeded = await userService.createUser(userid, ownerName, bio, email, password);

    if (!succeeded) {
      res.status(409).send(`User with userid ${userid} or email ${email} already exists`);
      return;
    }

    res.status(201).send("User created successfully")
  } catch (e: any) {
    res.status(500).send(e.message);
  }

});

type GetUserssRequest = Request & {
}

userRouter.get("/", async (req: GetUserssRequest, res: Response<UserInterface[] | string>) => {
  try {
    res.status(200).send(await userService.getUsers());
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

type LogoutRequest = Request & {
  session: {
    user?: UserInterface;
  }
}

userRouter.post("/login", async (
  req: UserRequest,
  res: Response<string | UserInterface>
) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (typeof (email) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- email has type
        ${typeof (email)}`);
      return;
    }
    if (typeof (password) !== "string") {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- passWord has type
        ${typeof (password)}`);
      return;
    }

    const user = await userService.findUserByEmailAndPwd(email, password);

    if (user == null) {
      res.status(409).send("Invalid username or password")
      return;
    }
    if (req.session.user == user) {
      res.status(409).send("User already logged in");
      return;
    }
    req.session.user = user;
    res.status(200).send(user);

  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

userRouter.post("/logout", async (
  req: LogoutRequest,
  res: Response<string>
) => {
  try {

    if (!req.session.user) {
      res.status(409).send("User already logged out");
      return;
    }

    req.session.user = undefined;
    res.status(200).send("User logged out");

  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

type currentUserReq = Request & {
  session: {
    user?: UserInterface;
  };
}

userRouter.get("/current_user", async (
  req: currentUserReq,
  res: Response<UserInterface | string>
) => {
  try {
    if (req.session.user == null) {
      res.status(400).send("No user is logged in");
      return;
    }
    const currentUserFromDb = await userService.findUserByID(req.session.user._id.toString());
    if (currentUserFromDb == null) {
      res.status(404).send("Could not find user data")
      return;
    }
    res.status(200).send(currentUserFromDb);
  } catch (e: any) {
    res.status(500).send(e.message);
  }

});
