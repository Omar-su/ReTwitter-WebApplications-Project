import React, { Children, useEffect, useState } from 'react';
import './App.css';
import './Profile.css'
import axios from 'axios';
import ProfileInfo from './Components/Profile/ProfileInfo';
import { TweetItem } from './App';
import { Reply, Tweet } from './App';

interface User {
  userNameID: string;
  ownerName: string;
  bio: string;
  followers: number;
  following: number;
  Tweets: Tweet[];
}


function Profile() {
  const [profileInfo, setProfileInfo] = useState<User>();

  async function updateProfileInfo() {
    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/account1",
    });
    setProfileInfo(response.data);
  }

  useEffect(() => {
    updateProfileInfo();
  }, []);

  return <div className="profile">
    <div id="profile-information">
      <h1>Account </h1>
      {!profileInfo ? "" :
        <ProfileInfo
          key={profileInfo.userNameID}
          userName={profileInfo.userNameID}
          ownerName={profileInfo.ownerName}
          bio={profileInfo.bio}
          followers={1}
          following={2} 
        ></ProfileInfo>}
    </div>
    <div id="profile-feed">
      {/*Reverse list of tweets so they are in chronological order*/}
      {!profileInfo ? "" : profileInfo.Tweets.slice(0).reverse().map((tweet) =>
        <TweetItem
          key={tweet.id}
          id={tweet.id}
          replies={tweet.replies}
          author={tweet.author}
          description={tweet.description}
          numberOfLikes={async () => {
            await axios.post(`http://localhost:9090/tweet/${tweet.id}`);
          }}
          numberOfReplies={tweet.numberOfReplies}>{tweet.numberOfLikes}
        </TweetItem>
      )}
    </div>
  </div>
}

export default Profile;