
import { User } from '../model/profile'
import { userModel } from '../db/user'

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
}
