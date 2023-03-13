import { ReplyInterface } from "../model/interfaces/reply.interface";
import { TweetInterface } from "../model/interfaces/tweet.interface";
import { UserInterface } from "../model/interfaces/user.interface";
import { connectToDataBase } from "./conn";
import { connUrlOrigin } from "./conn_url_origin";
import { replySchema } from "./reply";
import { tweetSchema } from "./tweet";
import { userSchema } from "./user";

export class DatabaseModels {

  replyModel;
  userModel;
  tweetModel;

  constructor(url : string){
    const conn = connectToDataBase(url);
    this.replyModel = conn.model<ReplyInterface>("Replies", replySchema);
    this.tweetModel = conn.model<TweetInterface>("Tweets", tweetSchema);
    this.userModel = conn.model<UserInterface>("Users", userSchema);
  }

  getReplyModel(){
    return this.replyModel;
  }

  
  getTweetModel(){
    return this.tweetModel;
  }

  getUserModel(){
    return this.userModel;
  }
}

// export const dataBaseModels = 
export function getDatabaseModels(url : string){
  return new DatabaseModels(url);
}


