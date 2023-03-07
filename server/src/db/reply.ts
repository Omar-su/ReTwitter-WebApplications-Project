import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { ReplyInterface } from "../model/interfaces/reply.interface";
import { conn } from "./conn";

const replySchema = new Schema({
  id : {
    type : Number,
    required : true,
    unique : true
  },
  author : {
    type : ObjectId,
    ref: "Users",
    required : true,
  },
  userNameOfOriginalTweet : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true,
  },
  numberofreplies : {
    type : Number,
    required : true,
  },
  numberoflikes : {
    type : Number,
    required : true,
  },
  replies : [{
    type : ObjectId,
    ref : "Replies",
    required : true,
  }] 
})

export const replyModel = conn.model<ReplyInterface>("Replies", replySchema);
