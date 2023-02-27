import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { conn } from "./conn";
import { Tweet } from "../model/tweet";
import { Reply } from "../model/reply";

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
    ref : "Replies"
  }] 
})

export const replyModel = conn.model<Reply>("Replies", replySchema);
