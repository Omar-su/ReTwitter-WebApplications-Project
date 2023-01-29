import { Profiler } from "inspector";
import { profile } from "../model/profile";
import { Tweet } from "../model/tweet";


const tweets : Tweet[] = [];


export function newFollow(profile : profile){
    profile.increaseFollowers();
}


export function follow(profile : profile){
  profile.increaseFollowing();
}


export function tweet(tweet : Tweet, profile : profile){
  profile.newTweet(tweet);
}

