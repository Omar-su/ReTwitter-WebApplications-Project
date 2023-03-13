import { createConnection } from "mongoose";

/**
 * Creates a connection with the database
 * @param url The url of the database
 * @returns Returns a connection to the database
 */
export function connectToDataBase(url : string){
  return createConnection(url);
}


