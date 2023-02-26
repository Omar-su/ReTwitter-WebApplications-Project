import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { User } from "../model/profile";
import { conn } from "./conn";

const userSchema = new Schema({
  username : {
    type : String,
    required : true,
    unique : true
  },
  name : {
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
    type : Number,
    required : true
  },
  following : {
    type : Number,
    required : true
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

