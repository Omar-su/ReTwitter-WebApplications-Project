import React, { useEffect, useState, useCallback } from 'react';
import './Profile.css';
import axios from 'axios';
import ProfileInfo from './ProfileInfo';
import { TweetItem } from '../home/TweetItem';
import { User } from '../../Interfaces';
import { useParams } from 'react-router-dom';
import { NavBar } from '../home/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
axios.defaults.withCredentials = true;

function ProfilePage() {


  return (
    <div className="container text-center">
      <div className="row align-items-start">
        <NavBar></NavBar>
        <div className="col">
          <ProfileFeed></ProfileFeed>
        </div>
        <div className="col">
        </div>
      </div>
    </div>
    
  );
}

function ProfileFeed(){
  const [profileInfo, setProfileInfo] = useState<User>();
  const { userNameID } = useParams<{ userNameID: string }>();
  const [isFollowed, setIsfollowed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const updateProfileInfo = useCallback(async () => {
    const response = await axios.get<User>(`http://localhost:9090/profile/${userNameID}`);
    setProfileInfo(response.data);
  }, [userNameID]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get<User>('http://localhost:9090/user/current_user');
        setCurrentUser(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);
  // Check if the list of followers includes the logged-in user's ID
  useEffect(() => {
    if (profileInfo && currentUser) {
      setIsfollowed(profileInfo.followers.some(followerID => followerID === currentUser.userNameID));
    }
    if(currentUser && profileInfo && currentUser.userNameID === profileInfo.userNameID){
      setIsOwner(true);
    }
  }, [currentUser, profileInfo]);


  useEffect(() => {
    updateProfileInfo();
  }, [isFollowed, updateProfileInfo]);

  async function followAccount() {
    if (isFollowed) {
      await axios.post(`http://localhost:9090/profile/${profileInfo?.userNameID}/unfollow`);
    } else {
      await axios.post(`http://localhost:9090/profile/${profileInfo?.userNameID}/follow`);
    }
    setIsfollowed(!isFollowed);
  }
  return(
    <div>
      <div className="profile">
        <div id="profile-information">
          {!profileInfo ? "" :
            <ProfileInfo
              key={profileInfo.userNameID}
              userName={profileInfo.userNameID}
              ownerName={profileInfo.ownerName}
              bio={profileInfo.bio}
              following={profileInfo.following.length}
              followers={profileInfo.followers.length}
              isFollowing={isFollowed}
              isOwner={isOwner}
              followAccount={followAccount}
            >           
            </ProfileInfo>
          }
        </div>
        <div id="profile-feed">
          {!profileInfo?.tweets.length ? <p id="notweettext">No tweets</p> : ""}
          {/* Reverse list of tweets so they are in chronological order */}
          {!profileInfo ? "" : profileInfo.tweets.slice(0).reverse().map((tweet) =>
            <TweetItem
              key={tweet.id}
              id={tweet.id}
              replies={tweet.replies}
              author={tweet.author}
              description={tweet.description}
              numberOfLikes={async () => {
                await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
              }}
              numberOfReplies={tweet.numberOfReplies}
            >
              {tweet.numberOfLikes}
            </TweetItem>
          )}
        </div>
      </div>
    </div>
  );

}

export default ProfilePage;
