import { userModel } from '../../db/user'
import { ReplyInterface } from '../../model/interfaces/reply.interface';
import { TweetInterface } from '../../model/interfaces/tweet.interface';
import { UserInterface } from '../../model/interfaces/user.interface';
import { UserServiceInterface } from '../interfaces/userservice.interface';

export class UserDBService implements UserServiceInterface {

    async getUsers(): Promise<UserInterface[]> {
        return await userModel.find();
    }

    async createUser(userNameID: string, ownerName: string, bio : string, email: string, password: string): Promise<boolean> {
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
                bio: bio,
                followers: [],
                following: [],
                tweets: [],
            })
        return !!newUser;
    }

    async findUserByEmailAndPwd(email: string, password: string): Promise<UserInterface | null> {
        const userLoggingIn = await userModel.findOne({ "email": email }).populate("tweets").exec();
        if(userLoggingIn?.password == password){
            return userLoggingIn;
        }
        return null;
    }

    async findUserByID(user_id: string): Promise<UserInterface | null> {
        return await userModel.findById(user_id).populate("tweets");
    }

    async findUserByUsername(userName: string): Promise<UserInterface | null> {
        return await userModel.findOne({ "userNameID": userName }).populate("tweets");
    }

    async getUserTweets(user: UserInterface): Promise<Array<TweetInterface> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            //TODO Somehow use foundUser.getTweets(); 
            return foundUser.tweets;
        }
        return null;
    }

    async getFollowingTweets(user: UserInterface): Promise<Array<TweetInterface> | null> {
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

        //tweets.sort(() => Math.random() - 0.5);

        return tweets;
    }

    async getUsersFollowers(user: UserInterface): Promise<Array<string> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            return foundUser.followers;
        }
        return null;
    }

    async getUsersFollowing(user: UserInterface): Promise<Array<string> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            return foundUser.following;
        }
        return null;
    }

    async followProfile(userNameBeingFollowed: string, user_idFollowing: string): Promise<boolean> {
        const toBeFollowed: UserInterface | null = await this.findUserByUsername(userNameBeingFollowed);
        const toFollow: UserInterface | null = await this.findUserByID(user_idFollowing);
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
        const toBeUnfollowed: UserInterface | null = await this.findUserByUsername(toBeUnfollowedUserName);
        const userUnfollowing: UserInterface | null = await this.findUserByID(userUnfollowingId);

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


    async updateUser(user: UserInterface): Promise<UserInterface | null> {
        const updatedUser = await userModel.findByIdAndUpdate(user._id.toString(), user, { new: true });
        return updatedUser;
    }

}

export function makeUserDBService() : UserServiceInterface {
    return new UserDBService;
}