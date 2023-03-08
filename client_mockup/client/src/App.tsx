import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookmarksPage } from "./components/bookmarks/BookmarkPage";
import Home from "./components/home/Home";
import HomePage from "./components/home/TweetItem";
import CreateAccount from "./components/login/CreateAccount";
import Login from "./components/login/Login";
import ResetPassword from "./components/login/ResetPassword";
import { Messages } from "./components/message_system/Messages";
import { NotificationPage } from "./components/notifications/NotificationPage";
import ProfilePage from "./components/profile/ProfilePage";
import { SettingsPage } from "./components/settings/Settings";


function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/bookmarks" element={<BookmarksPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/profile/:userNameID" element={<ProfilePage />} />
    </Routes>
  );
}

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;