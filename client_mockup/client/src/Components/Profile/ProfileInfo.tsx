import '../../Profile.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface profileInfoProps{
    key : string;
    userName : string;
    ownerName : string;
    bio : string;
    followers : number;
    following : number;
  }

  function ProfileInfo({key, userName, ownerName, bio, followers, following } : profileInfoProps){
    return <div>
      <img src="" alt="" />
      <div className='account-info'>
        <Container>
            <Row>
                <Col>Username: {userName}</Col>
                <Col>Name: {ownerName}</Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                    Bio: {bio}
                </Col>
            </Row>
            <Row className='mt-4' id='followings'>
                <Col>Followers: {followers}</Col>
                <Col>Following: {following}</Col>
            </Row>
        </Container>
      </div>
    </div>
  }

  export default ProfileInfo;