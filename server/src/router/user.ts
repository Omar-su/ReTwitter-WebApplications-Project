import express, { Request, Response } from "express";
import { makeRegisterationService } from "../service/user";
import { User } from "../model/profile";

export const registerationRouter = express.Router();

const registerationService = makeRegisterationService();

interface RegisterationRequest extends Request{
  body : {
    userid : string;
    ownerName : string;
    email : string;
    passWord : string;
  }
}
// TODO erros handling types of request 
registerationRouter.post("/", async(
  req : RegisterationRequest,
  res : Response<string>
)=> {
  try {
    const userid = req.body.userid;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const passWord = req.body.passWord;

    if (typeof(userid) !== "string" ) {
      res.status(400).send(`Bad POST call to ${req.originalUrl} --- userid has type
      ${typeof(userid)}`);
      return;
    }

    const succeeded = await registerationService.createUser(userid, ownerName, email, passWord);

    if (!succeeded) {
      res.status(409).send(`User with userid ${userid} already exists`);
    }
    res.status(201).send("User created successfully")
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});
