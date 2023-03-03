import { userModel } from "../../db/user";
import { User } from "../../model/user";

export async function createUser(username : string, name : string, email : string, password : string) : Promise<boolean> {
  if (await userModel.findOne({username : username, email : email})){
    return false;
  }

  await userModel.create({
    username : username,
    name : name,
    email : email,
    bio : "",
    followers : 0,
    following : 0,
    password : password,
    tweets : []
  });

  return true;
} 



export async function findUser(username : string, password : string) : Promise<User | undefined> {
  const user = await userModel.findOne({username : username, password : password});

  if (user == null) {
      return undefined;
  }
  
  return user;
}

