import mongoose, { ObjectId } from "mongoose";
import { UserInterface } from "./interfaces/user.interface";
import { TweetInterface } from "./interfaces/tweet.interface";

class User implements UserInterface {

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

  addTweet(newTweet: TweetInterface) {
    this.tweets.push(newTweet);
  }

  getTweets(): Array<TweetInterface> {
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