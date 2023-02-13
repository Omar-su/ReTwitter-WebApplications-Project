import express from "express";
import { tweetRouter } from "./router/tweet";
import { profileRouter } from "./router/profile"
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());
app.use("/", tweetRouter);
app.use("/", profileRouter);