import { TweetItem } from './TweetItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import TweetPage from './TweetItem';
import { TweetFeed } from './TweetFeed';
import { NavBar } from './NavBar';
import { NewsItems } from './NewsItem';
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
          <TweetFeed></TweetFeed>
        </div>
        <div className="col">
          <NewsItems></NewsItems>
        </div>
      </div>
    </div>
  );
}


export default Home;
