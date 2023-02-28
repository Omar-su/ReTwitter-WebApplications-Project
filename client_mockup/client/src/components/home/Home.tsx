import { TweetItem } from './TweetItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import App from './TweetItem';
// import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

// const navigatePage = (link: string) => {
//   navigate(link);
// }

function Home() {
  return (
    <div className="container text-center">
      <div className="row align-items-start">
        <NavBar></NavBar>
        <div className="col">
          <App></App>
        </div>
        <div className="col">Popular tweets/Popular TwitClone</div>
      </div>
    </div>
  );
}

function NavBar(){
  return(
    <div className="col-2">
    Menu
    <ul className="nav flex-column">
      <li className="nav-item">
        <a className="nav-link active top-buffer menu-links nav-button" aria-current="page" href="#">
          Home
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link top-buffer menu-links nav-button" href="notifications.html">
          Notifications
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link top-buffer menu-links nav-button" href="messages.html">
          Messages
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link top-buffer menu-links nav-button" href="bookmarks.html">
          Bookmark
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link top-buffer menu-links nav-button" href="profile.html">
          Profile
        </a>
      </li>
      <li className="nav-item">
        <a id="postbutton" className="nav-link top-buffer menu-links nav-button" href="#">
          Tweet
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link top-buffer menu-links nav-button" href="#">
          Settings
        </a>
      </li>
    </ul>
  </div>
  );
}

export default Home;
