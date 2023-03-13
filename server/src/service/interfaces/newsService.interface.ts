import { News } from "../../model/news";

export interface NewsServiceInterface{
  getNews() : Promise<News[] | any>;
}