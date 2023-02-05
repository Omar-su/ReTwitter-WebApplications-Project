import express from "express";
import { tweetRouter } from "./router/tweet";
import { profileRouter } from "./router/profile"

export const app = express();

app.use(express.json());
app.use("/", profileRouter);