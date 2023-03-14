
/**
 * News class in which you can create news objects from the api call 
 */
export class News{

  title : string;
  author : string;
  link : string;
  summary : string;
  published_date : Date;
  media : string;
  topic : string;

  /**
   * Constructor for a news object
   * @param title - title
   * @param author - name of the author
   * @param link - link to the news article
   * @param summary - short summary of the news
   * @param published_date - date of publication
   * @param media - media
   * @param topic - topic
   */
  constructor(title : string, author : string, link : string, summary : string, published_date : Date, media : string, topic : string ){
    this.title = title;
    this.author = author;
    this.link = link;
    this.summary = summary;
    this.published_date = published_date;
    this.media = media;
    this.topic = topic;
  }


}