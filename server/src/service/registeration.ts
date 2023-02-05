import { User } from "../model/profile";
import { getBio, getEmail, getOwnerName, getUserName } from "../model/registration"

class RegistrationService{

  async createUser(userid : string, ownerName : string, bio : string) : Promise<User>{
    const newUser = new User(userid, ownerName , bio);
    return newUser;
  }

}


export function makeRegisterationService(){
  return new RegistrationService;
}