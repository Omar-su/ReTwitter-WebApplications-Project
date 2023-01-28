import express from "express";
import { taskRouter } from "./router/task";

export const app = express();

app.use(express.json());
app.use("/task", taskRouter);