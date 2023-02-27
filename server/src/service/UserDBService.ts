
import { User } from '../model/profile'
import { userModel } from '../db/user'
import { Tweet } from '../model/tweet';

export class UserDBService {

    async getUsers(): Promise<User[]> {
        return await userModel.find();
    }

    async createUser(userNameID: string, ownerName: string, email: string, password: string): Promise<boolean> {
        const existingUsername = await userModel.findOne({ userNameID: userNameID });
        const existingEmail = await userModel.findOne({ email: email });
        if (existingUsername || existingEmail) {
            // A user with the given userNameID already exists, return false
            return false;
        }
    
        const newUser = await userModel.create(
            {
                userNameID: userNameID,
                ownerName: ownerName,
                password: password,
                email: email,
                bio: "",
                followers: [],
                following: [],
                tweets: [],
            })
        return (newUser instanceof User);
    }

    async findUserByEmailAndPwd(email: string, password: string): Promise<User | null> {
        return await userModel.findOne({ email: email }, { password: password }).populate("tweets");
    }

    async findUserByID(userNameID: string): Promise<User | null> {
        return await userModel.findOne({ userNameID: userNameID }).populate("tweets");
    }

    async getUserTweets(userNameID: string): Promise<Array<Tweet> | null> {
        const user = await this.findUserByID(userNameID);
        if (user != null) {
            return user.getTweets();
        }
        return null;
    }

    async getUsersFollowers(userNameID: string): Promise<Array<string> | null> {
        const user = await this.findUserByID(userNameID);
        if (user) {
            return user.getFollowers();
        }
        return null;
    }

    async getUsersFollowing(userNameID: string): Promise<Array<string> | null> {
        const user = await this.findUserByID(userNameID);
        if (user) {
            return user.getFollowing();
        }
        return null;
    }

    async updateUser(user: User): Promise<User | null> {
        const updatedUser = await userModel.findOneAndUpdate({ userNameID: user.userNameID }, user, { new: true });
        return updatedUser;
    }
}

export const userDBService = new UserDBService();
