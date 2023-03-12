import express, { Request, response, Response } from "express";
import { connUrlOrigin } from "../db/conn_url_origin";
import { ReplyInterface } from "../model/interfaces/reply.interface";
import { TweetInterface } from "../model/interfaces/tweet.interface";
import { UserInterface } from "../model/interfaces/user.interface";
import { makeTweetDBService } from "../service/db/TweetDBService";
import { makeUserDBService } from "../service/db/UserDBService";
import { TweetServiceInterface } from "../service/interfaces/tweetservice.interface";
import { UserServiceInterface } from "../service/interfaces/userservice.interface";
import { databasemodels } from "./user";

export const tweetRouter = express.Router();

const tweetService: TweetServiceInterface = makeTweetDBService(databasemodels);
const userService: UserServiceInterface = makeUserDBService(databasemodels);

type GetTweetsRequest = Request & {
    params: {
        id?: string;
    };
    session: {
        user?: UserInterface;
    }
}

tweetRouter.get("/", async (req: GetTweetsRequest, res: Response<TweetInterface[] | string>) => {
    try {
        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const tweets = await userService.getUserTweets(req.session.user);
        if (tweets == null) {
            res.status(500).send("Failed to get user tweets");
            return;
        }
        res.status(200).send(tweets);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

tweetRouter.get("/feed", async (req: GetTweetsRequest, res: Response<TweetInterface[] | string>) => {
    try {
        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const tweets = await userService.getFollowingTweets(req.session.user);
        if (tweets == null) {
            res.status(500).send("Failed to get feed tweets");
            return;
        }
        res.status(200).send(tweets);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

tweetRouter.get("/feed/replies/:id", async (req: GetTweetsRequest, res: Response<ReplyInterface[] | string>) => {
    try {
        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        if (req.params.id == null) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
            return;
        }
        const id: number = parseInt(req.params.id, 10);
        if (!(id > 0)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
            return;
        }
        const replies = await tweetService.getRepliesOnTweet(id);
        if (replies == null) {
            res.status(500).send("Failed to get feed tweets");
            return;
        }
        res.status(200).send(replies);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

type TweetRequest = Request & {
    body: { description: string };
    session: { user?: UserInterface }
}

tweetRouter.post("/", async (
    req: TweetRequest,
    res: Response<TweetInterface | string>
) => {
    try {
        const description = req.body.description;

        if (typeof (description) !== "string") {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type
            ${typeof (description)}`);
            return;
        }
        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const newTweet = await tweetService.createTweet(req.session.user.userNameID, description);
        res.status(201).send(newTweet);
    } catch (e: any) {
        res.status(500).send(e.message);
    }

});

type LikeTweetRequest = Request & {
    params: {
        id: string;
    };
    body: {};
    session: {
        user?: UserInterface;
    };
}

type LikeTweetResponse = Response<string>;

tweetRouter.post("/:id", async (
    req: LikeTweetRequest,
    res: LikeTweetResponse
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
            return;
        }
        const id: number = parseInt(req.params.id, 10);
        if (!(id > 0)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
            return;
        }
        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const succeeded = await tweetService.likeOrUnlikeTweet(req.session.user, id);

        if (!succeeded) {
            res.status(404).send(`No tweet with id number ${id}`);
            return;
        }

        res.status(200).send("Like status toggled");
    } catch (e: any) {
        res.status(500).send(e.message);
    }

});

type ReplyRequest = Request & {
    params: { id: string };
    body: { author: string, description: string };
    session: { user?: UserInterface };

}

// TODO THIS IS FOR TESTING
tweetRouter.post("/reply/:id",
    async (
        req: ReplyRequest,
        res: Response<string>
    ) => {
        try {
            const desc = req.body.description;

            if (typeof (desc) !== "string") {
                res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing body data`);
                return;
            }

            if (req.params.id == null) {
                res.status(400).send("Id not found");
                return;
            }
            const id: number = parseInt(req.params.id, 10);
            // const id : number = req.body.id;
            if (!(id > 0)) {
                res.status(400).send("Id not found");
                return;
            }

            if (req.session.user == null) {
                res.status(401).send("Not logged in");
                return;
            }
            const succeeded = await tweetService.replyOnTweetOrReply(req.session.user, id, desc);

            if (!succeeded) {
                res.status(404).send("Tweet not found");
                return;
            }
            res.status(200).send("Succeeded");
        } catch (e: any) {
            res.status(500).send(e.message);
        }

    });

type DeleteRequest = Request & {
    params: { id: string };
    body: {};
    session: { user?: UserInterface };
}

tweetRouter.delete("/:id", async (req: DeleteRequest, res: Response<string>) => {
    try {

        if (req.params.id == null) {
            res.status(400).send("Id not found");
            return;
        }

        const id: number = parseInt(req.params.id, 10);
        // const id : number = req.body.id;
        if (!(id > 0)) {
            res.status(400).send("Id not found");
            return;
        }

        if (req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }

        const succeeded = await tweetService.deleteTweet(req.session.user, id);

        if (!succeeded) {
            res.status(400).send("Tweet not found or not owner of tweet");
            return;
        }
        res.status(200).send("Tweet was deleted");

    } catch (e: any) {
        res.status(500).send(e.message);
    }

});