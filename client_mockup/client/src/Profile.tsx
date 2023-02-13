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
const[accountInfo, setAccountInfo] = useState<User[]>([]);

let accountID = "account1";

async function updateAccountInfo(){
    const response = await axios({
      method: 'get',
      url: "http://localhost:9090/profile/1",
      params: {
        userID : "account1"
      }
    });
    setAccountInfo(response.data);
    console.log(response.data);
}

useEffect(() =>{
  console.log("UseEFF called")
    updateAccountInfo();
}, [accountInfo]);

    return <div>
        <h1> {"Account info1"}</h1>
        <div>
          "hello"
        {accountInfo.map((data) => <AccountInfo key={data.userNameID} 
        ownerName = {data.ownerName} bio = "{data.bio}" followers ={1}
        following = {2} ></AccountInfo>)}
      </div>
    </div>
}

interface accountInfoProps{
    key : string;
    ownerName : string;
    bio : string;
    followers : number;
    following : number;
    children?: React.ReactNode;
  }

  function AccountInfo({key, ownerName, bio, followers, following, } : accountInfoProps){
    return <div>
      <img src="" alt="" />
      <div className='account-info'>
        <p className='id'>{key}</p>
        <p className='owner'>{ownerName}</p>
        <p className='bio'>{bio}</p>
      </div>
    </div>
  }

export default Profile;