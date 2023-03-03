import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { User } from "../model/user";
import { conn } from "./conn";

const userSchema : Schema = new Schema({
  
  userNameID : {
    type : String,
    required : true,
    unique : true
  },
  ownerName : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  bio : {
    type : String,
    required : true
  },
  followers : {
    type: [String],
    required : true
  },
  following : {
    type: [String],
    required: true
  },
  password : {
    type : String,
    required : true,
  },
  tweets : [{
    type : ObjectId,
    ref : "Tweets"
  }]
});

export const userModel = conn.model<User>("Users", userSchema);

