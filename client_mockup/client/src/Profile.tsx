import React, { Children, useEffect, useState } from 'react';
import './App.css';
import './Profile.css'
import axios from 'axios';
import ProfileInfo from './components/profile/ProfileInfo';
import { TweetItem } from './App';
import { Tweet, Reply, User } from './Interfaces';



function Profile() {
  const [profileInfo, setProfileInfo] = useState<User>();

  async function updateProfileInfo() {

    // TODO REMOVE HARD CODING
    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/account1",
    });
    setProfileInfo(response.data);
  }

  useEffect(() => {
    updateProfileInfo();
  }, [profileInfo]);

  return <div className="profile">
    <div id="profile-information">
      {!profileInfo ? "" :
        <ProfileInfo
          key={profileInfo.userNameID}
          userName={profileInfo.userNameID}
          ownerName={profileInfo.ownerName}
          bio={profileInfo.bio}
          following={profileInfo.following}
          followers={profileInfo.followers}
          followAccount={ async () => {
            await axios.post(`http://localhost:9090/profile/${profileInfo.userNameID}/follow`,
            {
              // TODO: REMOVE HARD CODING
              "follower" : "account2"
            });
          }}
        ></ProfileInfo>}
    </div>
    <div id="profile-feed">
      {!profileInfo?.Tweets.length ? <p id="notweettext">No tweets</p> : ""}
      {/*Reverse list of tweets so they are in chronological order*/}
      {!profileInfo ? "": profileInfo.Tweets.slice(0).reverse().map((tweet) =>
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