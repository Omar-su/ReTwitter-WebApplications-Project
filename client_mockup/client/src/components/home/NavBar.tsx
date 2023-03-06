
export function NavBar() {
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
      </ul>
    </div>
  );
}