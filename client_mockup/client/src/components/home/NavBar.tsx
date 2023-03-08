import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true

export function NavBar() {

  const navigate = useNavigate();

  const navigatePage = (link: string) => {
    navigate(link);
  }

  async function LogOut(){
    await axios.post("http://localhost:9090/user/logout")
      .then(function (response) {
        console.log(response);
        navigatePage("/login");
      })
      .catch(function (error) {
        console.log(error);
      }); 
  }

  return (
    <div className="col-2">
      Menu
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link active top-buffer menu-links nav-button" aria-current="page" href="/home">
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
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="#" onClick={LogOut}>
            Log out
          </a>
        </li>
      </ul>
    </div>
  );
}