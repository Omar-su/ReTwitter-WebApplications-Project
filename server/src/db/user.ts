import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { UserInterface } from "../model/interfaces/user.interface";
import { connectToDataBase } from "./conn";

/**
 * A user schema which is used to represent the user class in the database
 */
export const userSchema : Schema = new Schema({
  
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


