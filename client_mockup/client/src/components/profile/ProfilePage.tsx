import React, { Children, useEffect, useState } from 'react';
import './Profile.css'
import axios from 'axios';
import ProfileInfo from './ProfileInfo';
import { TweetItem } from '../home/HomePage';
import { Tweet, Reply, User } from '../../Interfaces';
import { useParams } from 'react-router-dom';
axios.defaults.withCredentials = true

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState<User>();
  const { userNameID } = useParams();

  async function updateProfileInfo() {

    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/" + userNameID,
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
          following={profileInfo.following.length}
          followers={profileInfo.followers.length}
          followAccount={ async () => {
            await axios.post(`http://localhost:9090/profile/${profileInfo.userNameID}/follow`)
          }}
        ></ProfileInfo>}
    </div>
    <div id="profile-feed">
      {!profileInfo?.tweets.length ? <p id="notweettext">No tweets</p> : ""}
      {/*Reverse list of tweets so they are in chronological order*/}
      {!profileInfo ? "": profileInfo.tweets.slice(0).reverse().map((tweet) =>
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

export default ProfilePage;