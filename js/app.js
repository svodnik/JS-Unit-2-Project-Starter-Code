/*
  Please add all Javascript code to this file.
  GA-JS-SF-8 Jason Meyers
*/

'use strict'

$(function() {

  const newsApiUrl = 'newsapi.org/v1/articles';
  const newsApiKey = '69565f54b6c94a02b92830b2a8452177';

  function makeUrl(url, apikey, query){
    let outPut = "";
    outPut += "https://" + url;
    outPut += "?" + query;
    outPut += "&apiKey=" + apikey;
    return outPut;
  }

  makeUrl(newsApiUrl, newsApiKey, 'source=the-next-web');


$.ajax({
    url: makeUrl(newsApiUrl, newsApiKey, 'source=the-next-web'),
    context: document.body
  })
    .done(function(response) {
    let articles = response.articles;
    let sectionContainer = $('#main');
    $(articles).each(function(articles) {

      let article = `
      <article class="article">

        <section class="featuredImage">
          <img src="${this.urlToImage}" alt="" />
        </section>

        <section class="articleContent">
          <a href="${this.url}"><h3>${this.title}</h3></a>
          <h6>Lifestyle</h6>
        </section>

        <section class="impressions">
          526
        </section>
        <div class="clearfix"></div>
      </article>
      `;

      sectionContainer.append(article);

    })
  }
  )
});
