
// Does not differ a lot from a tweet, however it is connected to a tweet
// TODO discuss if comment == tweet

import { User } from "./profile";
import { Tweet } from "./tweet";

// Comment has a reference to the original tweet
export class Reply extends Tweet{
    userNameOfOriginalTweet : string;
    
    constructor( author : User, description : string, userNameOfOriginalTweet : string){
        super(author, description);
        this.userNameOfOriginalTweet = userNameOfOriginalTweet;
    }
}