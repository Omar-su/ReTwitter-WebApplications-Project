import { ReplyInterface } from "./reply.interface";

export interface TweetInterface {
    _id: any;
    id: number;
    author: string;
    description: string;
    numberOfLikes: number;
    numberOfReplies: number;
    usersThatLikedTheTweet : string[];
    replies: ReplyInterface[];

    increaseNrLikes(): void;
    increaseNrComments(): void;
    addReply(newReply: ReplyInterface): void;
}