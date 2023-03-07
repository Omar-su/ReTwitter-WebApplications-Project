import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { TweetInterface } from "../model/interfaces/tweet.interface";
import { conn } from "./conn";

const tweetSchema = new Schema({
  id : {
    type : Number,
    required : true,
    unique : true
  },
  author : {
    type : String,
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
    ref : "Replies",
    required : true,
  }] 
})

export const tweetModel = conn.model<TweetInterface>("Tweets", tweetSchema);
