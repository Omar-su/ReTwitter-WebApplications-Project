export interface TweetInterface {
    id: number;
    author: string;
    description: string;
    numberOfLikes: number;
    numberOfReplies: number;
    replies: Reply[];

    increaseNrLikes(): void;
    increaseNrComments(): void;
    addReply(newReply: Reply): void;
}