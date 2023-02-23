import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import CreateAccount from "./components/login/CreateAccount";
import Login from "./components/login/Login";
import ResetPassword from "./components/login/ResetPassword";
import ProfilePage from "./components/profile/ProfilePage";


function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
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