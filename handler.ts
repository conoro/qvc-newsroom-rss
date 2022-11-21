// QVC Newsroom RSS - Copyright Conor O'Neill 2022, conor@conoroneill.com
// LICENSE Apache-2.0

// Output is currently at https://2n3wfjo1h9.execute-api.eu-west-1.amazonaws.com/

import { Handler } from 'aws-lambda';
import axios from 'axios';
import cheerio from 'cheerio';
import { Feed } from "feed";

export class QVCScraper {
    async scrapeNews(url: string) {

        const feed = new Feed({
            title: "QVC Newsroom Feed",
            description: "RSS feed for QVC news website",
            id: "https://corporate.qvc.com/newsroom/",
            link: "https://corporate.qvc.com/newsroom/",
            language: "en", 
            image: "https://corporate.qvc.com/wp-content/plugins/newsroom/themes/qvc-corporate/images/QVC_PrimaryLogo.png",
            favicon: "https://corporate.qvc.com/wp-content/plugins/newsroom/themes/qvc-corporate/images/favicon/favicon-196x196.png",
            copyright: "2022 © QVC. All Rights Reserved.",
            updated: new Date(),
            generator: "AWS Lambda",
            feedLinks: {
              rss: "https://example.com/rss"
            },
            author: {
              name: "QVC",
              email: "example@example.com",
              link: "https://corporate.qvc.com/lp/contact-us/"
            }
          });

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        $("article").each(function() {
          let story = $(this).find(".article-detail").find("a").first();
          if (story) {
            let postLink = story.attr("href");
            let postText = story.attr("title");
            if (postLink && postText){

              let pubdate = $(this).find(".dotdotdot").text().split(":")[0];
              let publishDateTime = new Date(pubdate + " 06:00");
              let imageURL =  $(this).find(".featured-img-container").attr("style").match(/\((.*?)\)/)[1].replace(/('|")/g,'');

              feed.addItem({
                  title: postText,
                  id: postLink,
                  link: postLink || '',
                  description: postText,
                  content: '<img src="'+ imageURL + '"/><br>' + '<a href="'+ postLink + '">' + postText + "</a>",
                  author: [
                    {
                      name: "QVC",
                      email: "example@example.com",
                      link: "https://corporate.qvc.com/lp/contact-us/"
                    }
                  ],
                  date: publishDateTime,
                  image: imageURL
                });
            }
          }
        });
        return(feed.rss2());
    }
}


export const rss: Handler = async (event: any) => {
  const scraper = new QVCScraper();
  let feed = await scraper.scrapeNews("https://corporate.qvc.com/newsroom/");
  const response = {
    statusCode: 200,
    headers: {
        'Content-Type': 'text/xml'
    },
    body: feed,
  };
  return(response);
}

