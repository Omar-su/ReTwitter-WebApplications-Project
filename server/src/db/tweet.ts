import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { conn } from "./conn";
import { Tweet } from "../model/tweet";

const tweetSchema = new Schema({
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
  description : {
    type : String,
    required : true,
  },
  numberOfReplies : {
    type : Number,
    required : true,
  },
  numberOfLikes : {
    type : Number,
    required : true,
  },
  replies : [{
    type : ObjectId,
    ref : "Replies"
  }] 
})

export const tweetModel = conn.model<Tweet>("Tweets", tweetSchema);
