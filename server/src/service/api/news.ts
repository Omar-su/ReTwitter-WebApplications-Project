import { News } from '../../model/news';
import axios from 'axios';
import { NewsServiceInterface } from '../interfaces/newsService.interface';
axios.defaults.withCredentials = true

class NewsService implements NewsServiceInterface{

  // api call : https://api.newscatcherapi.com/v2/search?q=sport&from=1_day_ago&countries=SE&lang=en&page_size=3
  // params : from, countries, lang, page_size
  // Headers: x-api-key = 2Cu6B_7-Eggew3Vmz9fJBfdBAp06kk5Ka8taIdwH5S8

  /**
   * Sends an api call to newscatcher and gets back sports news of yesterday in english in sweden
   * @returns Returns sport news in english
   */
  async getNews() : Promise<News[] | any>{
    const apiKey = '2Cu6B_7-Eggew3Vmz9fJBfdBAp06kk5Ka8taIdwH5S8';
    const topic = 'sport';
    const country = 'SE';
    const language = 'en';
    const pageSize = 7;
    const date = '1_day_ago'
    const url = `https://api.newscatcherapi.com/v2/search?q=${topic}&from=${date}&countries=${country}&lang=${language}&page_size=${pageSize}`;
  
    
    const response = await axios.get(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    if (response.status != 200) {
      return response;
    }
    const data = response.data;
    
    const newsList = data.articles.map(
      (article: any) =>
        new News(
          article.title,
          article.author,
          article.link,
          article.summary,
          new Date(article.published_date),
          article.media,
          article.topic
        )
    );

    return newsList;
  }


}

/**
 * Creates and returns a newsservice object
 */
export function makeNewsApiService() : NewsServiceInterface {
  return new NewsService;
}