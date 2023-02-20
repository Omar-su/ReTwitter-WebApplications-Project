import { User } from "../model/profile";

class RegistrationService{

  users : User[] = [];

  async createUser(userid : string, ownerName : string, email : string, passWord : string) : Promise<boolean>{
    if(this.users.some(user => user.userNameID === userid)){
      return false;
    }

    const newUser = new User(userid, ownerName , email, passWord);
    this.users.push(newUser);

    return true;
  }

  async findUser(userID : string, password : string) : Promise<User | undefined>{
    return this.users.find(user => user.userNameID == userID && user.passWord === password);
  }

}


export function makeRegisterationService(){
  return new RegistrationService;
}