import { Reply } from "./reply";

export class Tweet {
  
    id : number;  
    author : string;
    description : string;
    numberOfLikes : number;
    numberOfReplies : number;
    comments : Reply[];

    // Optional
    // number of views, number of shares, 
    
    //Default values for some parameters as they should not be set 
    constructor(author : string, description : string) {
        this.id = Date.now();
        this.author = author;
        this.description = description;
        this.numberOfReplies = 0;
        this.numberOfLikes = 0;
        this.comments = [];
    }

    // currently tweet can not be edited
    // what changes is only the numbers of likes and comments

    increaseNrLikes(){
      this.numberOfLikes += 1;
    }


    private increaseNrComments(){
      this.numberOfReplies += 1;
    }

    addReply(newReply : Reply ){
      this.comments.push(newReply);
      this.increaseNrComments();
    }
}