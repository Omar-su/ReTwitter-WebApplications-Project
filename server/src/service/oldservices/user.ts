import { User } from "../model/user";

class UserService {

  users: User[] = [];

  async createUser(userid: string, ownerName: string, email: string, password: string): Promise<boolean> {
    if (this.users.some(user => user.userNameID === userid)) {
      return false;
    }

    if (this.users.some(user => user.email === email)) {
      if (this.users.some(user => user.email === email)) {
        return false;
      }

      const newUser = new User(userid, ownerName, email, password);
      const newUser = new User(userid, ownerName, email, password);
      this.users.push(newUser);

      return true;
    }
  }

  async findUserByEmailAndPwd(email: string, password: string): Promise<User | undefined> {
    return this.users.find(user => user.email == email && user.password === password);
  }



  async getUsers(): Promise<User[] | undefined> {
    return this.users;
  }


  async findUserByID(userNameID: string): Promise < User | undefined > {
  return this.users.find(user => user.userNameID === userNameID);
}



}

  export function makeUserService() {
    return new UserService;
  }
