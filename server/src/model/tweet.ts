
import { TweetInterface } from "./interfaces/tweet.interface";
import { ReplyInterface } from "./interfaces/reply.interface";

/**
 * A tweet class which represents the posts that the users are able to create
 */
export class Tweet implements TweetInterface {

  id: number;
  author: string;
  description: string;
  numberOfLikes: number;
  numberOfReplies: number;
  usersThatLikedTheTweet : string [];
  replies: ReplyInterface[];
  _id: any;

  /**
   * Constructor for a tweet with some default values that should not be set on creation
   * @param author - string of userNameID
   * @param description - string of the description
   */
  constructor(author: string, description: string) {
    this.id = Date.now();
    this.author = author;
    this.description = description;
    this.numberOfReplies = 0;
    this.numberOfLikes = 0;
    this.usersThatLikedTheTweet = [];
    this.replies = [];
  }

  /**
   * Increase the number of likes
   */
  increaseNrLikes() {
    this.numberOfLikes += 1;
  }

  /**
   * Increase the number of replies
   */
  increaseNrComments() {
    this.numberOfReplies += 1;
  }

  /**
   * Add a reply to a tweet
   * @param newReply - reply that implements ReplyInterface
   */
  addReply(newReply: ReplyInterface) {
    this.replies.push(newReply);
    this.increaseNrComments();
  }
}

/**
 * Creates a tweet with dependency inversion by returning an interface type 
 * @param author author of the tweet
 * @param description description of the tweet
 * @returns a new tweet
 */
export function newTweet(author: string, description: string) : TweetInterface {
  return new Tweet(author, description);
} 