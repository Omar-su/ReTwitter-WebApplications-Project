import React, {Children, useEffect, useState} from 'react';
import './App.css';
import './Profile.css'
import axios from 'axios';
import ProfileInfo from './Components/Profile/ProfileInfo';

interface User {
  userNameID : string;
  ownerName : string;
  bio : string;
  followers : number;
  following : number;
  Tweets : Array<Tweet>;
}

interface Tweet{
    id : number;  
    author : string;
    description : string;
    numberOfLikes : number;
    numberOfReplies : number;
    comments : Reply[];
}

interface Reply extends Tweet{
  userNameOfOriginalTweet : string;
}

function Profile() {
const[profileInfo, setProfileInfo] = useState<User>();

async function updateProfileInfo(){
    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/account1",
    });
    setProfileInfo(response.data);
}

useEffect(() =>{
    updateProfileInfo();
}, []);

    return <div> 
        <div className="profile-page">
          {!profileInfo ?  "" : <ProfileInfo key={profileInfo.userNameID}
          userName={profileInfo.userNameID} ownerName = {profileInfo.ownerName} 
          bio = {profileInfo.bio} followers ={1} following = {2} ></ProfileInfo> }
        </div>
    </div>
}

export default Profile;