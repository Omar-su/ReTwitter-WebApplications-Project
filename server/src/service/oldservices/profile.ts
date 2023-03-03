import { User } from "../model/user";
import { Tweet } from "../model/tweet";
import { userService } from "../router/user";


class ProfileService {

  tweets: Array<Tweet> = [];


  async followProfile(followee: string, follower: string): Promise<boolean> {
    const toBeFollowed : User | null = await userService.findUserByID(followee);
    const toFollow : User | null = await userService.findUserByID(follower);
    if (toBeFollowed == null || toFollow == null) {
      return false;
    }
    toBeFollowed.addFollower(toFollow.userNameID);
    toFollow.addFollowing(toBeFollowed.userNameID);
    return true;
  }

  async unfollowProfile(toBeUnfollowedId: string, userUnfollowingId: string): Promise<boolean> {
    const toBeUnfollowed: User | null = await userService.findUserByID(toBeUnfollowedId);
    const userUnfollowing: User | null = await userService.findUserByID(userUnfollowingId);
  
    if (toBeUnfollowed == null || userUnfollowing == null) {
      return false;
    }
  
    toBeUnfollowed.removeFollower(userUnfollowing.userNameID);
    userUnfollowing.removeFollowing(toBeUnfollowed.userNameID);
  
    return true;
  }



  async getFollowers(userID : string): Promise<Array<string> | null> {
    const user : User | null = await userService.findUserByID(userID);
    if(user){
      return user.getFollowers();
    }
    return null;
  }

  async getFollowing(userID : string): Promise<string[] | null> {
    const user : User | null = await userService.findUserByID(userID);
    if(user){
      return user.getFollowing();
    }
    return null;
  }

  async getProfile(userID: string): Promise<User | null> {  
    const user : User | null = await userService.findUserByID(userID);
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

