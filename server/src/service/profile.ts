import { User } from "../model/profile";
import { Tweet } from "../model/tweet";
import { userService } from "../router/user";


class ProfileService {

  tweets: Array<Tweet> = [];

  async getTweets(userID: string): Promise<Array<Tweet> | null> {
    const user : User | undefined = await userService.findUserByID(userID);
    if (user != null) {
      const tweets = user.getTweets();
      return tweets;
    } else {
      return null;
    }
  }

  async tweet(userID: string, description: string): Promise<boolean> {
    const user : User | undefined = await userService.findUserByID(userID); 
    if (user != null) {
      const newTweet = new Tweet(user.userNameID, description);
      user.newTweet(newTweet);
      return true;
    } else {
      return false;
    }
  }

  async followProfile(followee: string, follower: string): Promise<boolean> {
    const toBeFollowed : User | undefined = await userService.findUserByID(followee);
    const toFollow : User | undefined = await userService.findUserByID(follower);
    if (toBeFollowed == null || toFollow == null) {
      return false;
    }
    toBeFollowed.addFollower(toFollow.userNameID);
    toFollow.addFollowing();
    return true;
  }

  async unfollowProfile(unFollowee: string, unFollower: string): Promise<boolean> {
    const toBeUnfollowed: User | undefined = await userService.findUserByID(unFollowee);
    const toUnfollow: User | undefined = await userService.findUserByID(unFollower);
  
    if (toBeUnfollowed == null || toUnfollow == null) {
      return false;
    }
  
    toBeUnfollowed.removeFollower(toUnfollow);
    toUnfollow.removeFollowing();
  
    return true;
  }



  async getFollowers(userID : string): Promise<Array<string> | null> {
    const user : User | undefined = await userService.findUserByID(userID);
    if(user){
      return user.getFollowers();
    }
    return null;
  }

  async getFollowing(userID : string): Promise<number | null> {
    const user : User | undefined = await userService.findUserByID(userID);
    if(user){
      return user.getFollowing();
    }
    return null;
  }

  async getProfile(userID: string): Promise<User | null> {  
    const user : User | undefined = await userService.findUserByID(userID);
    if (user) {
      return user;
    }
    return null;
  }
  
  /*
    // TODO TAKE THIS OUT OF HERE
    async createUser(userID : string, ownerName : string, bio : string) : Promise<User>{
      const newUser = new User(userID, ownerName, bio);
      this.users.push(newUser);
      return newUser;
    } */

}

export function makeProfileService(): ProfileService {
  return new ProfileService;
}

