import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './NewsItem.css'



axios.defaults.withCredentials = true

interface News {
  title : string;
  author ?: string;
  link : string;
  summary : string;
  published_date : Date;
  media ?: string;
  topic ?: string;
}

interface NewsItemProps {
  title : string;
  author ?: string;
  link : string;
  summary : string;
  published_date : Date;
  media ?: string;
  topic ?: string;
}

function NewsItem({title, author, link , summary, published_date, media, topic} : NewsItemProps){
  const formattedDate = published_date.toString().split(' ').slice(0, 4).join(' ');
  return (
    <div className="news-card">
      <div className="news-content">
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>
      <div className="news-date">
        <p>{formattedDate}</p>
      </div>
      <div>
        <a href={link} target="_blank">Read more</a>
      </div>
    </div>
  );
}


export function NewsItems(){
  const[news, setNews] = useState<News[]>([]);

  async function updateNews(){
    const response = await axios.get<News[]>("http://localhost:9090/news");
    setNews(response.data);
  }

  useEffect(()=>{
    updateNews();
  }, []);

  return(
    <div className='news-cards'>
      <h1 className='news-text'>
        Sport News
      </h1>
      {news.map((news) => <NewsItem title={news.title} link={news.link} summary={news.summary} published_date={news.published_date}></NewsItem>)}
    </div>
  );
}


