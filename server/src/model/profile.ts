import { Tweet } from "./tweet";

export class User {

  userNameID: string;
  ownerName: string;
  password: string;
  bio: string;
  email: string;
  followers: string[];
  following: number;
  tweets: Tweet[];

  constructor(userNameID: string, ownerName: string, email: string, password: string) {
    this.userNameID = userNameID;
    this.ownerName = ownerName;
    this.password = password;
    this.email = email;
    this.bio = "";
    this.followers = [];
    this.following = 0;
    this.tweets = [];
  }


  addFollower(follower: string) {
    this.followers.push(follower);
  }

  addFollowing() {
    this.following++;
  }

  removeFollower(follower: User) {
    function removeObjectWithId(arr: string[], toRemove: string) {
      return arr.filter((userName) => userName !== toRemove);
    }

    this.followers = removeObjectWithId(this.followers, follower.userNameID);
  }

  isFollowedBy(userNameID : string) : boolean{
    return this.followers.includes(userNameID);
  }

  removeFollowing() {
    this.following--;
  }

  newTweet(newTweet: Tweet) {
    this.tweets.push(newTweet);
  }

  getTweets(): Array<Tweet> {
    return this.tweets;
  }

  getFollowers(): string[] {
    return this.followers;
  }

  getFollowing(): number {
    return this.following;
  }

  setBio(bio: string) {
    this.bio = bio;
  }

}