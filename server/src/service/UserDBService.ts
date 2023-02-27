
import { User } from '../model/profile'
import { userModel } from '../db/user'
import { Tweet } from '../model/tweet';

class UserDBService {

    async getUsers(): Promise<User[]> {
        return await userModel.find();
    }

    async createUser(userNameID: string, ownerName: string, email: string, password: string): Promise<boolean> {
        const newUser = await userModel.create(
            {
                userNameID: userNameID,
                ownerName: ownerName,
                email: email,
                password: password,

            })
        return (newUser instanceof User);
    }

    async findUserByEmailAndPwd(email: string, password: string): Promise<User | null> {
        return await userModel.findOne({ email: email }, { password: password });
    }

    async findUserByID(userNameID: string): Promise<User | null> {
        return await userModel.findOne({ userNameID: userNameID });
    }

    async getUserTweets(userNameID: string): Promise<Array<Tweet> | null> {
        const user = await userModel.findOne({ userNameID: userNameID })
        if (user != null) {
            return user.getTweets();
        }
        return null;
    }

    async getUsersFollowers(userNameID : string): Promise<Array<string> | null> {
        const user = await userModel.findOne({userNameID: userNameID});
        if(user){
          return user.getFollowers();
        }
        return null;
      }
}
