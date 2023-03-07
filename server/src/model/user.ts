import mongoose, { ObjectId } from "mongoose";
import { Tweet } from "./tweet";
import { UserInterface } from "./interfaces/user.interface";
import { TweetInterface } from "./interfaces/tweet.interface";

export class User implements UserInterface {

  _id!: ObjectId;
  userNameID: string;
  ownerName: string;
  password: string;
  bio: string;
  email: string;
  followers: string[];
  following: string[];
  tweets: TweetInterface[];

  constructor(userNameID: string, ownerName: string, email: string, password: string) {
    this.userNameID = userNameID;
    this.ownerName = ownerName;
    this.password = password;
    this.email = email;
    this.bio = "";
    this.followers = [];
    this.following = [];
    this.tweets = [];
  }


  addFollower(follower: string) {
    this.followers.push(follower);
  }

  addFollowing(toFollow: string) {
    this.following.push(toFollow);
  }

  removeFollower(unfollowerID: string) {
    function removeObjectWithId(arr: string[], unfollowerID: string) {
      return arr.filter((userName) => userName !== unfollowerID);
    }

    this.followers = removeObjectWithId(this.followers, unfollowerID);
  }

  isFollowedBy(userNameID: string): boolean {
    return this.followers.includes(userNameID);
  }

  removeFollowing(toUnfollowID: string) {
    function removeObjectWithId(arr: string[], toUnfollowID: string) {
      return arr.filter((userName) => userName !== toUnfollowID);
    }

    this.followers = removeObjectWithId(this.following, toUnfollowID);
  }

  addTweet(newTweet: Tweet) {
    this.tweets.push(newTweet);
  }

  getTweets(): Array<Tweet> {
    return this.tweets;
  }

  getFollowers(): string[] {
    return this.followers;
  }

  getFollowing(): string[] {
    return this.following;
  }

  setBio(bio: string) {
    this.bio = bio;
  }

}