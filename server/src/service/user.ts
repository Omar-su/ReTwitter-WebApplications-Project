import { User } from "../model/profile";

class UserService{

  users : User[] = [];

  async createUser(userid : string, ownerName : string, email : string, password : string) : Promise<boolean>{
    if(this.users.some(user => user.userNameID === userid)){
      return false;
    }

    const newUser = new User(userid, ownerName , email, password);
    this.users.push(newUser);

    return true;
  }

  async findUser(email : string, password : string) : Promise<User | undefined>{
    return this.users.find(user => user.email == email && user.password === password);
  }

}


export function makeUserService(){
  return new UserService;
}