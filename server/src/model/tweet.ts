import { Comment } from "./comment";

export class Tweet {
  
    id : number;  
    author : string;
    description : string;
    numberOfLikes : number;
    numberOfComments : number;
    comments : Comment[];

    // Optional
    // number of views, number of shares, 
    
    //Default values for some parameters as they should not be set 
    constructor(author : string, description : string) {
        this.id = Date.now();
        this.author = author;
        this.description = description;
        this.numberOfComments = 0;
        this.numberOfLikes = 0;
        this.comments = [];
    }

    // currently tweet can not be edited
    // what changes is only the numbers of likes and comments

    increaseNrLikes(){
      this.numberOfLikes += 1;
    }


    private increaseNrComments(){
      this.numberOfComments += 1;
    }

    addComment(newComment : Comment ){
      this.comments.push(newComment);
      this.increaseNrComments();
    }
}