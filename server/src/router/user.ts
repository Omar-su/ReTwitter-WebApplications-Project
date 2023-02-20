import express, { Request, Response } from "express";
import { makeUserService } from "../service/user";
import { User } from "../model/profile";
export const userRouter = express.Router();

const userService = makeUserService();

type UserRequest = Request &{
  body : {
    userid : string;
    ownerName : string;
    email : string;
    password : string;
  }
  session : {
    user ?: User;
  }
}
// TODO erros handling types of request 
userRouter.post("/", async(
  req : UserRequest,
  res : Response<string>
)=> {
  try {
    const userid = req.body.userid;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const password = req.body.password;

    if (typeof(userid) !== "string" ) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- userid has type
      ${typeof(userid)}`);
      return;
    }
    if (typeof(ownerName) !== "string" ) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- ownername has type
      ${typeof(ownerName)}`);
      return;
    }
    if (typeof(email) !== "string" ) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- email has type
      ${typeof(email)}`);
      return;
    }
    if (typeof(password) !== "string" ) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- passWord has type
      ${typeof(password)}`);
      return;
    }

    const succeeded = await userService.createUser(userid, ownerName, email, password);

    if (!succeeded) {
      res.status(409).send(`User with userid ${userid} already exists`);
    }
    res.status(201).send("User created successfully")
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});

userRouter.post("/login", async (
  req : UserRequest,
  res : Response<string> 
)=> {
    try {
      const userid = req.body.userid;
      const ownerName = req.body.ownerName;
      const email = req.body.email;
      const password = req.body.password;

      if (typeof(userid) !== "string" ) {
        res.status(400).send(`Bad POST call to ${req.originalUrl} --- userid has type
        ${typeof(userid)}`);
        return;
      }
      if (typeof(ownerName) !== "string" ) {
        res.status(400).send(`Bad POST call to ${req.originalUrl} --- ownername has type
        ${typeof(ownerName)}`);
        return;
      }
      if (typeof(email) !== "string" ) {
        res.status(400).send(`Bad POST call to ${req.originalUrl} --- email has type
        ${typeof(email)}`);
        return;
      }
      if (typeof(password) !== "string" ) {
        res.status(400).send(`Bad POST call to ${req.originalUrl} --- passWord has type
        ${typeof(password)}`);
        return;
      }

      const user = await userService.findUser(userid, password);

      if(user == null){
        res.status(409).send("Invalid user name or password")
        return;
      }

      req.session.user = user;
      res.status(200).send("logged in");

    } catch (error) {
      
    }
});
