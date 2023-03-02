import express, { Request, Response } from "express";
import { makeUserDBService } from "../service/db/UserDBService";
import { User } from "../model/profile";

export const userRouter = express.Router();

export const userService = makeUserDBService();

type UserRequest = Request &{
  body : {
    userid ?: string;
    ownerName ?: string;
    email : string;
    password : string;
  }
  session : {
    user ?: User;
  }
}

userRouter.post("/", async(
  req : UserRequest,
  res : Response<string>
)=> {
  try {
    const userid : string = req.body.userid;
    const ownerName : string = req.body.ownerName;
    const email : string = req.body.email;
    const password : string = req.body.password;

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
      res.status(409).send(`User with userid ${userid} or email ${email} already exists`);
      return;
    }

    res.status(201).send("User created successfully")
  } catch (e:any) {
    res.status(500).send(e.message);
  }

});

type GetUserssRequest = Request &{
}

userRouter.get("/", async(req: GetUserssRequest, res: Response<User[] | string>) => {
  try {
      res.status(200).send(await userService.getUsers());
  } catch (e:any) {
      res.status(500).send(e.message);
  }
});


userRouter.post("/login", async (
  req : UserRequest,
  res : Response<string | User> 
)=> {
    try {
      const email : string = req.body.email;
      const password : string = req.body.password;

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

      const user = await userService.findUserByEmailAndPwd(email, password);

      if(user == null){
        res.status(409).send("Invalid user name or password")
        return;
      }
      if (req.session.user == user) {
        res.status(409).send("User already logged in");
        return;
      }
      req.session.user = user;
      res.status(200).send(user);

    } catch (e : any) {
      res.status(500).send(e.message);      
    }
});

type currentUserReq = Request & {
  session: {
    user?: User;
  };
}


userRouter.get("/current_user", async (
  req: currentUserReq,
  res: Response<User | string>
) => {
  try {
    if(req.session.user == null){
      res.status(400).send("No user is logged in");
      return;
    }
    console.log("Current user: " + req.session.user)
    res.status(200).send(req.session.user);
  } catch (e : any) {
    res.status(500).send(e.message);      
  }
  
});
