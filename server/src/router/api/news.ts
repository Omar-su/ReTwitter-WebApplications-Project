import express, { Request, Response } from "express";
import { UserInterface } from "../../model/interfaces/user.interface";
import { News } from "../../model/news";
import { makeNewsApiService } from "../../service/api/news";

export const newsRouter = express.Router();

const newsService = makeNewsApiService();

type NewsGetRequest = Request &{
  session : {user ?: UserInterface};
} 

newsRouter.get("/", async ( 
  req : NewsGetRequest,
  res : Response<News[] | string>, 
) => {
  try {
    if (req.session.user == null) {
      res.status(401).send("Not logged in");
      return;
    }
    const data = await newsService.getNews();
    if (!data) {
      res.status(404).send("Failed external api call");
    }
    res.status(200).send(data);
  } catch (e:any) {
    res.status(500).send(e.message);
  }
});


