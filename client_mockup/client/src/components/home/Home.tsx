import { TweetItem } from './TweetItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import TweetPage from './TweetItem';
import { NavBar } from './NavBar';
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
          <TweetPage></TweetPage>
        </div>
        <div className="col">Popular tweets/Popular TwitClone</div>
      </div>
    </div>
  );
}


export default Home;
