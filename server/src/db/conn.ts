import { createConnection } from "mongoose";

export function connectToDataBase(url : string){
  return createConnection(url);
}

// export const conn = createConnection("mongodb+srv://omarsu:twitterclone@twittercluster.o2gwrlp.mongodb.net/test");

