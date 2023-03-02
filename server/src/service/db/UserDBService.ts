
import { User } from '../../model/profile'
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
        return await userModel.findOne({ email: email }, { password: password }).populate("tweets");
    }

    async findUserByID(user_id: string): Promise<User | null> {
        return await userModel.findById(user_id).populate("tweets");
    }

    async getUserTweets(user: User): Promise<Array<Tweet> | null> {
        const foundUser = await this.findUserByID(user._id.toString());
        if (foundUser) {
            return foundUser.tweets;
        }
        return null;
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

    async updateUser(user: User): Promise<User | null> {
        const updatedUser = await userModel.findByIdAndUpdate(user._id.toString(), user, { new: true });
        return updatedUser;
    }
}

export function makeUserDBService() {
    return new UserDBService;
}