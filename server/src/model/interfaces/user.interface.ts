import { ObjectId } from "mongoose";
import { TweetInterface } from "./tweet.interface";

export interface UserInterface {
    _id: ObjectId;
    userNameID: string;
    ownerName: string;
    password: string;
    bio: string;
    email: string;
    followers: string[];
    following: string[];
    tweets: TweetInterface[];

    addFollower(follower: string): void;
    addFollowing(toFollow: string): void;
    removeFollower(unfollowerID: string): void;
    removeFollowing(toUnfollowID: string): void;
    isFollowedBy(userNameID: string): boolean;
    addTweet(newTweet: TweetInterface): void;
    getTweets(): Array<TweetInterface>;
    getFollowers(): string[];
    getFollowing(): string[];
    setBio(bio: string): void;

}