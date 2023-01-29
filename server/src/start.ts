import express from "express";
import { tweetRouter } from "./router/tweet";

export const app = express();

app.use(express.json());
app.use("/", tweetRouter);