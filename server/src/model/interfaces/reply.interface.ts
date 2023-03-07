import { TweetInterface } from "./tweet.interface";

export interface ReplyInterface extends TweetInterface{
    userNameOfOriginalTweet: string;
}