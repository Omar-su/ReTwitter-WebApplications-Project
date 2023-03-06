
import { User } from '../../model/user'
import { userModel } from '../../db/user'
import { Tweet } from '../../model/tweet';

export class UserDBService {

    async getUsers(): Promise<User[]> {
        return await userModel.find();
    }

    async createUser(userNameID: string, ownerName: string, email: string, password: string): Promise<boolean> {
        const existingUsername = await userModel.findOne({ userNameID: userNameID });
        const existingEmail = await userModel.findOne({ email: email });
        if (existingUsername || existingEmail) {
            // A user with the given userNameID or email already exists, return false
            return false;
        }

        const newUser = await userModel.create(
            {
                userNameID: userNameID,
                ownerName: ownerName,
                password: password,
                email: email,
                bio: "Test bio",
                followers: [],
                following: [],
                tweets: [],
            })
        return !!newUser;
    }

    async findUserByEmailAndPwd(email: string, password: string): Promise<User | null> {
        const userLoggingIn = await userModel.findOne({ "email": email }).populate("tweets").exec();
        if(userLoggingIn?.password == password){
            return userLoggingIn;
        }
        return null;
    }

    async findUserByID(user_id: string): Promise<User | null> {
        return await userModel.findById(user_id).populate("tweets");
    }

    async findUserByUsername(userName: string): Promise<User | null> {
        return await userModel.findOne({ "userNameID": userName }).populate("tweets");
    }

    async getUserTweets(user: User): Promise<Array<Tweet> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            //TODO Somehow use foundUser.getTweets(); 
            return foundUser.tweets;
        }
        return null;
    }

    async getFollowingTweets(user: User): Promise<Array<Tweet> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (!foundUser) {
            return null;
        }

        const followings = foundUser.following;
        const tweets = foundUser.tweets;
      
        for (const following of followings) {
          const foundFollowing = await this.findUserByUsername(following.toString());
          if (foundFollowing) {
            tweets.push(...foundFollowing.tweets);
          }
        }

        tweets.sort(() => Math.random() - 0.5);

        return tweets;
    }

    async getUsersFollowers(user: User): Promise<Array<string> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            return foundUser.followers;
        }
        return null;
    }

    async getUsersFollowing(user: User): Promise<Array<string> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            return foundUser.following;
        }
        return null;
    }

    async followProfile(userNameBeingFollowed: string, user_idFollowing: string): Promise<boolean> {
        const toBeFollowed: User | null = await this.findUserByUsername(userNameBeingFollowed);
        const toFollow: User | null = await this.findUserByID(user_idFollowing);
        if (toBeFollowed == null || toFollow == null) {
            return false;
        }

        //TODO, Somehow use user objects methods for adding followers and following
        toBeFollowed.followers.push(toFollow.userNameID);
        toFollow.following.push(toBeFollowed.userNameID);
        this.updateUser(toBeFollowed);
        this.updateUser(toFollow);
        return true;
    }

    async unfollowProfile(toBeUnfollowedUserName: string, userUnfollowingId: string): Promise<boolean> {
        const toBeUnfollowed: User | null = await this.findUserByUsername(toBeUnfollowedUserName);
        const userUnfollowing: User | null = await this.findUserByID(userUnfollowingId);
        console.log("TBU" + toBeUnfollowed);
        console.log("UU " + userUnfollowing);

        if (toBeUnfollowed == null || userUnfollowing == null) {
            return false;
        }
        function removeObjectWithId(arr: string[], unfollowerID: string) {
            return arr.filter((userName) => userName !== unfollowerID);
        }

        //TODO, Somehow use user objects methods for removing followers and following
        toBeUnfollowed.followers = removeObjectWithId(toBeUnfollowed.followers, userUnfollowing.userNameID);
        userUnfollowing.following = removeObjectWithId(userUnfollowing.following, toBeUnfollowed.userNameID);
        this.updateUser(toBeUnfollowed);
        this.updateUser(userUnfollowing);
        return true;
    }


    async updateUser(user: User): Promise<User | null> {
        const updatedUser = await userModel.findByIdAndUpdate(user._id.toString(), user, { new: true });
        return updatedUser;
    }

}

export function makeUserDBService() {
    return new UserDBService;
}