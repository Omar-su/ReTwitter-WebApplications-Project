import express, { Request, Response } from "express";
import { makeRegisterationService } from "../service/registeration";
import { User } from "../model/profile";

export const registerationRouter = express.Router();

const registerationService = makeRegisterationService();

registerationRouter.post("/registeration", async(
  req : Request<{},{},{userid : string, ownername : string, bio : string, email : string}>,
  res : Response<User>
)=> {
  try {
    const userid = req.body.userid;
    const ownerName = req.body.ownername;
    const email = req.body.email;


    const newUser = await registerationService.createUser(userid, ownerName, email)
    res.status(201).send(newUser);
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});
