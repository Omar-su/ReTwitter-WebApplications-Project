import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { TweetInterface } from "../model/interfaces/tweet.interface";
import { connectToDataBase } from "./conn";

export const tweetSchema = new Schema({
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
  usersThatLikedTheTweet : [{
    type : String,
    required : true,
  }],
  replies : [{
    type : ObjectId,
    ref : "Replies",
    required : true,
  }] 
})


// export const tweetModel = conn.model<TweetInterface>("Tweets", tweetSchema);
