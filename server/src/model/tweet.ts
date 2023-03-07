import { Reply } from "./reply";
import { User } from "./user";
import { TweetInterface } from "./interfaces/tweet.interface";

export class Tweet implements TweetInterface {

  id: number;
  author: string;
  description: string;
  numberOfLikes: number;
  numberOfReplies: number;
  replies: Reply[];

  // Optional
  // number of views, number of shares, 

  //Default values for some parameters as they should not be set 
  constructor(author: string, description: string) {
    this.id = Date.now();
    this.author = author;
    this.description = description;
    this.numberOfReplies = 0;
    this.numberOfLikes = 0;
    this.replies = [];
  }

  // currently tweet can not be edited
  // what changes is only the numbers of likes and comments

  increaseNrLikes() {
    this.numberOfLikes += 1;
  }

  increaseNrComments() {
    this.numberOfReplies += 1;
  }

  addReply(newReply: Reply) {
    this.replies.push(newReply);
    this.increaseNrComments();
  }
}