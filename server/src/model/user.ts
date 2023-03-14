import mongoose, { ObjectId } from "mongoose";
import { UserInterface } from "./interfaces/user.interface";
import { TweetInterface } from "./interfaces/tweet.interface";

/**
 * User class that represents users in the app
 */
class User implements UserInterface {

  _id!: ObjectId;
  userNameID: string;
  ownerName: string;
  password: string;
  bio: string;
  email: string;
  // The user's followers 
  followers: string[];
  //the users, the user follow
  following: string[];
  tweets: TweetInterface[];

  /**
   * Constructor of a user
   * @param userNameID - UsernameID
   * @param ownerName - Name of the user 
   * @param email - Email of the user
   * @param password - Password
   */
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

  /**
   * Adds a specific follower to the user
   * @param follower - string of the follower
   */
  addFollower(follower: string) {
    this.followers.push(follower);
  }

  /**
   * Adds a user to the list of following
   * @param toFollow - string of the user to follow
   */
  addFollowing(toFollow: string) {
    this.following.push(toFollow);
  }

  /**
   * Removes a follower if the ID can be found
   * @param unfollowerID - string of followerID
   */
  removeFollower(unfollowerID: string) {
    function removeObjectWithId(arr: string[], unfollowerID: string) {
      return arr.filter((userName) => userName !== unfollowerID);
    }

    this.followers = removeObjectWithId(this.followers, unfollowerID);
  }

  /**
   * Checks if the user is followed by a specific user
   * @param userNameID - string of userNameID
   * @returns true if the user is followed by the specific userNameID
   */
  isFollowedBy(userNameID: string): boolean {
    return this.followers.includes(userNameID);
  }

  /**
   * Unfollow specific user that is already followed
   * @param toUnfollowID - string of userNameID
   */
  removeFollowing(toUnfollowID: string) {
    function removeObjectWithId(arr: string[], toUnfollowID: string) {
      return arr.filter((userName) => userName !== toUnfollowID);
    }

    this.followers = removeObjectWithId(this.following, toUnfollowID);
  }

  /**
   * Add a tweet
   * @param newTweet - Tweet that implements the TweetInterface
   */
  addTweet(newTweet: TweetInterface) {
    this.tweets.push(newTweet);
  }

  /**
   * Get a list of all the tweets from the user
   * @returns an array of tweets
   */
  getTweets(): Array<TweetInterface> {
    return this.tweets;
  }

  /**
   * Get all the followers to this user
   * @returns array of userNameID
   */
  getFollowers(): string[] {
    return this.followers;
  }

  /**
   * Get all users this user follows
   * @returns array of userNameID
   */
  getFollowing(): string[] {
    return this.following;
  }

  /**
   * Set a new bio
   * @param bio 
   */
  setBio(bio: string) {
    this.bio = bio;
  }

}