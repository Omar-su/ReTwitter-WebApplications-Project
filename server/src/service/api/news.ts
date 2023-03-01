import { News } from '../../model/news';
import axios from 'axios';
axios.defaults.withCredentials = true

class NewsService{

  // api call : https://api.newscatcherapi.com/v2/search?q=sport&from=1_day_ago&countries=SE&lang=en&page_size=3
  // params : from, countries, lang, page_size
  // Headers: x-api-key = 2Cu6B_7-Eggew3Vmz9fJBfdBAp06kk5Ka8taIdwH5S8
  async getNews(){
    const apiKey = '2Cu6B_7-Eggew3Vmz9fJBfdBAp06kk5Ka8taIdwH5S8';
    const topic = 'sport';
    const country = 'SE';
    const language = 'en';
    const pageSize = 3;
    const date = '1_day_ago'
    const url = `https://api.newscatcherapi.com/v2/search?q=${topic}&from=${date}&countries=${country}&lang=${language}&page_size=${pageSize}`;
  
    
    const response = await axios.get(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    
    const data = response.data;

    const newsList = data.articles.map(
      (article: any) =>
        new News(
          article.title,
          article.author,
          article.link,
          article.summary,
          new Date(article.published_date),
          article.media
        )
    );

    return newsList;
  }


}


export function makeNewsApiService() : NewsService {
  return new NewsService;
}