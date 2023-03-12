import { ObjectId } from "mongodb";
import { Connection, Schema } from "mongoose";
import { ReplyInterface } from "../model/interfaces/reply.interface";
import { connectToDataBase } from "./conn";
import { connUrlOrigin } from "./conn_url_origin";

export const replySchema = new Schema({
  id : {
    type : Number,
    required : true,
    unique : true
  },
  author : {
    type : String,
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




// export const replyModel = conn.model<ReplyInterface>("Replies", replySchema);
