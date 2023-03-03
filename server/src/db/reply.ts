import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { conn } from "./conn";
import { Tweet } from "../model/tweet";

const replySchema = new Schema({
  id : {
    type : Number,
    required : true,
    unique : true
  },
  author : {
    type : String,
    required : true,
  },
  threadauthor : {
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

export const twitterModel = conn.model<Tweet>("Replies", replySchema);
