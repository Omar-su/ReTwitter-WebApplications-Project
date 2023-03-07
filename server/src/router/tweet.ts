import express, { Request, response, Response } from "express";
import { UserInterface } from "../model/interfaces/user.interface";
import { Tweet } from "../model/tweet";
import { makeTweetDBService } from "../service/db/TweetDBService";
import { makeUserDBService } from "../service/db/UserDBService";

export const tweetRouter = express.Router();

const tweetService = makeTweetDBService();
const userService = makeUserDBService();

type GetTweetsRequest = Request &{
    session : {
        user ?: UserInterface;
    }
}

tweetRouter.get("/", async(req: GetTweetsRequest, res: Response<Tweet[] | string>) => {
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
    } catch (e:any) {
        res.status(500).send(e.message);
    }
});

tweetRouter.get("/feed", async(req: GetTweetsRequest, res: Response<Tweet[] | string>) => {
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
    } catch (e:any) {
        res.status(500).send(e.message);
    }
});


type TweetRequest = Request &{
    body : {description : string};
    session : { user ?: UserInterface}
}

tweetRouter.post("/", async( 
    req: TweetRequest,
    res: Response<Tweet | string>
) => {
    try {
        const description = req.body.description;
    
        if (typeof(description) !== "string" ) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- description has type
            ${typeof(description)}`);
            return;
        }
        if(req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const newTweet = await tweetService.createTweet(req.session.user.userNameID, description);
        res.status(201).send(newTweet);
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});

type LikeTweetRequest = Request & {
    params : {
        id : string;
    };
    body : {};
    session : {
        user ?: UserInterface;
    };
}

type LikeTweetResponse = Response<string>;

tweetRouter.post("/:id", async (
    req : LikeTweetRequest,
    res : LikeTweetResponse
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing id param`);
            return;
        }
        const id : number = parseInt(req.params.id, 10);
        if (! (id > 0)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id number must be a positive integer`);
            return;
        }
        if(req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
        const succeeded = await tweetService.likeTweet(req.session.user, id);
        
        if (! succeeded) {
            res.status(404).send(`No tweet with id number ${id}`);
            return;
        }

        res.status(200).send("tweet number of likes increased");
    } catch (e:any) {
        res.status(500).send(e.message);
    }

});

type ReplyRequest = Request & {
    params : {id : string};
    body : { author : string, description : string};
    session : { user ?: UserInterface};
}

// TODO THIS IS FOR TESTING
// tweetRouter.post("/reply/:id",
//     async(
//     req : ReplyRequest,
//     res : Response<string>
//     )=>{
//     try {
//         const author = req.body.author;
//         const desc = req.body.description;

//         if(typeof(desc) !== "string" || typeof(author) !== "string" || typeof(req.session.user?.ownerName)!== "string" ){
//             res.status(400).send(`Bad POST call to ${req.originalUrl} --- missing body data`);
//             return;
//         }
        
//         if (req.params.id == null) {
//             res.status(400).send("Id not found");
//             return;
//         }
//         const id : number = parseInt(req.params.id, 10);
//         // const id : number = req.body.id;
//         if (! (id > 0)) {
//             res.status(400).send("Not found id");
//             return;
//         }

//         if(req.session.user == null) {
//             res.status(401).send("Not logged in");
//             return;
//         }
//         const succeeded = await tweetService.replyOnTweet(req.session.user , id, desc);

//         if (! succeeded) {
//             res.status(404).send("does not work");
//             return;
//         }
//         res.status(200).send("succeeded");
//     } catch (e:any) {
//         res.status(500).send(e.message);
//     }

// });

type DeleteRequest = Request &{
    params : { id : string};
    body : {};
    session : { user ?: UserInterface};
}

tweetRouter.post("/delete/:id", async( req : DeleteRequest , res : Response<string>) =>{
    try {

        if (req.params.id == null) {
            res.status(400).send("Id not found");
            return;
        }
    
        const id : number = parseInt(req.params.id, 10);
        // const id : number = req.body.id;
        if (! (id > 0)) {
            res.status(400).send("ID not found");
            return;
        }
    
        if(req.session.user == null) {
            res.status(401).send("Not logged in");
            return;
        }
    
        const succeeded = await tweetService.deleteTweet(req.session.user, id);
    
        if (! succeeded) {
            res.status(404).send("The tweet was not found");
            return;
        }
        res.status(200).send("succeeded");

    } catch (e : any) {
        res.status(500).send(e.message);        
    }
    
});