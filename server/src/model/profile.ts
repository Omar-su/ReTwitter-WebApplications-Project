import { Tweet } from "./tweet";

export class User {

  userNameID: string;
  ownerName: string;
  password: string;
  bio: string;
  email: string;
  followers: User[];
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


  addFollower(follower: User) {
    this.followers.push(follower);
  }

  addFollowing() {
    this.following++;
  }

  removeFollower(follower: User) {
    function removeObjectWithId(arr: User[], userNameID: string) {
      return arr.filter((obj) => obj.userNameID !== userNameID);
    }

    this.followers = removeObjectWithId(this.followers, follower.userNameID);
  }

  isFollowedBy(user : User) : boolean{
    return this.followers.includes(user);
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

  getFollowers(): User[] {
    return this.followers;
  }

  getFollowing(): number {
    return this.following;
  }

  setBio(bio: string) {
    this.bio = bio;
  }

}