// News class in which you can create news objects from the api call
export class News{

  title : string;
  author : string;
  link : string;
  summary : string;
  published_date : Date;
  media : string;

  constructor(title : string, author : string, link : string, summary : string, published_date : Date, media : string ){
    this.title = title;
    this.author = author;
    this.link = link;
    this.summary = summary;
    this.published_date = published_date;
    this.media = media;
  }


}