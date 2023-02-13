import React, {Children, useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

interface Profile {
    userID : string;
    ownerName : string;
    bio : string;
}

function Profile() {
const[accountInfo, setAccountInfo] = useState<Profile[]>([]);

let accountID = "account1";

async function getAccountInfo(){
    const response = await axios.get<Profile[]>("http://localhost:9090/account1");
    setAccountInfo(response.data);
}

useEffect(() =>{
    getAccountInfo();
}, [accountInfo]);

    return <div>
        <h1> {"Account info"}</h1>
        <div>
        {accountInfo.map((data) => <AccountInfo key={data.userID} 
        ownerName = {data.ownerName} bio = {data.bio} followers ={1}
        following = {2}></AccountInfo>)}
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