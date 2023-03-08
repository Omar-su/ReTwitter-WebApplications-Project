import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "../../Interfaces";
import './NavBar.css'

axios.defaults.withCredentials = true

export function NavBar() {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get<User>('http://localhost:9090/user/current_user');
        setCurrentUser(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

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
      <ul className="nav flex-column text-color">
        <li className="nav-item">
          <a className="nav-link active top-buffer menu-links nav-button" aria-current="page" href="" onClick={() => navigatePage("/home")}>
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={() => navigatePage(`/notifications`)}>
            Notifications
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={() => navigatePage(`/messages`)}>
            Messages
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={() => navigatePage(`/bookmarks`)}>
            Bookmark
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={() => navigatePage(`/profile/${currentUser?.userNameID}`)}>
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a id="postbutton" className="nav-link top-buffer menu-links nav-button" href="">
            Tweet
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={() => navigatePage(`/settings`)}>
            Settings
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link top-buffer menu-links nav-button" href="" onClick={LogOut}>
            Log out
          </a>
        </li>
      </ul>
    </div>
  );
}