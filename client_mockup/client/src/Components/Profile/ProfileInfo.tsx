import '../../Profile.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface profileInfoProps{
    key : string;
    userName : string;
    ownerName : string;
    bio : string;
    following : number;
    followers : number;
    followAccount : () => Promise<void>;
  }

  function ProfileInfo({key, userName, ownerName, bio, following, followers, followAccount } : profileInfoProps){
    return <div>
      <img src="" alt="" />
      <div className='account-info'>
        <Container>
            <Row>
              <Col><h1>{ownerName}</h1></Col>
            </Row>
            <Row>
                <Col id="username">@{userName}</Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                    Bio: {bio}
                </Col>
            </Row>
            <Row className='mt-4' id='followings'>
                <Col>Following: {following}</Col>
                <Col>Followers: {followers}</Col>
                <Col><button id="follow-button" onClick={followAccount}>Follow</button></Col>
            </Row>
        </Container>
      </div>
    </div>
  }

  export default ProfileInfo;