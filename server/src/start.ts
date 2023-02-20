import express from "express";
import { tweetRouter } from "./router/tweet";
import { profileRouter } from "./router/profile"
import cors from "cors";

export const app = express();

import session from "express-session";
import { registerationRouter } from "./router/registeration";

app.use(session({
  secret : "Your secret key", // TODO Move to separate file. DO NOT UPLOAD TO GITHUB!!!!
  resave : false,
  saveUninitialized : true
}));

app.use(cors({
  origin: true,
  credentials : true
}));

app.use(express.json());
app.use(cors());
app.use("/tweet", tweetRouter);
app.use("/profile", profileRouter);
app.use("/registeration", registerationRouter);
