import { TweetItem } from './TweetItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
import TweetPage from './TweetItem';
import { TweetFeed } from './TweetFeed';
import { NavBar } from './NavBar';
import { NewsItems } from './NewsItem';
import './Home.css'

function Home() {
  return (
    <div className='home_body'>
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
    </div>
  );
}


export default Home;
