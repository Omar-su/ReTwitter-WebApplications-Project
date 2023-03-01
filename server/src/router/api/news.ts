import express, { Request, Response } from "express";
import { News } from "../../model/news";
import { User } from "../../model/user";
import { makeNewsApiService } from "../../service/api/news";

export const newsRouter = express.Router();

const newsService = makeNewsApiService();

type NewsGetRequest = Request &{
  session : {user ?: User};
} 

newsRouter.get("/", async ( 
  req : NewsGetRequest,
  res : Response<News[] | any>, 
) => {
  try {
    // if (req.session.user == null) {
    //   res.status(401).send("Not logged in");
    //   return;
    // }
    const data = await newsService.getNews();
    res.status(200).send(data);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});


