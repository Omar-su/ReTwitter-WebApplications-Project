import express from "express";
import { tweetRouter } from "./router/tweet";
import { profileRouter } from "./router/profile"
import { userRouter } from "./router/user";

import cors from "cors";

export const app = express();

import session from "express-session";
import { newsRouter } from "./router/api/news";
import { replyRouter } from "./router/reply";

app.use(session({
  secret : "Your secret key", // TODO Move to separate file. DO NOT UPLOAD TO GITHUB!!!!
  resave : false,
  saveUninitialized : true
}));

app.use(cors({
  origin: true ,
  credentials : true
}));

app.use(express.json());
app.use("/news" , newsRouter)
app.use("/reply" , replyRouter)
app.use("/tweet", tweetRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
