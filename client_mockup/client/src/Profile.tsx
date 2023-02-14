import React, {Children, useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

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
const[accountInfo, setAccountInfo] = useState<User>();

async function updateAccountInfo(){
    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/account1",
    });
    setAccountInfo(response.data);
}

useEffect(() =>{
    updateAccountInfo();
}, []);

    return <div> 
    
        <h1> {"Account info"}</h1>
        <div>
      {!accountInfo ? "AccountInfo is null" : <AccountInfo key={accountInfo.userNameID} 
        ownerName = {accountInfo.ownerName} bio = {accountInfo.bio} followers ={1}
        following = {2} ></AccountInfo>}
      </div>
    </div>

}

interface accountInfoProps{
    key : string;
    ownerName : string;
    bio : string;
    followers : number;
    following : number;
  }

  function AccountInfo({key, ownerName, bio, followers, following } : accountInfoProps){
    return <div>
      <img src="" alt="" />
      <div className='account-info'>
        <p className='id'>{key}</p>
        <p className='owner'>{ownerName}</p>
        <p className='bio'>{bio}</p>
        <p className='followers'>{followers}</p>
        <p className='following'>{following}</p>
      </div>
    </div>
  }

export default Profile;