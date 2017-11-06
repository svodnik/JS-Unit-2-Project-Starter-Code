/*
  Please add all Javascript code to this file.
  GA-JS-SF-8 Jason Meyers
*/


//start of IIFE
//
// (function() {
//
// let feedData = [
//   {id: 'newsapi', key: '69565f54b6c94a02b92830b2a8452177', feedUrl: },
//   {id: 'dailywtf', key: '', feedurl: 'http://thedailywtf.com/api/articles/random'}
// ]
//
// document.getElementById('newsJump').addEventListener('click', function(e){
//   // Using event delegation to pick up the anchor of our newsJump
//   if (e.target && e.target.matches('a')){
//     e.preventDefault();
//     const feedId = e.target.dataset.id;
//     // const feedUrl = e.target.href;
//     console.log(makeUrl(feedId));
//   }
// })
//
// function makeUrl(id){
//   let outPut = "";
//   outPut += id;
//
//   return outPut;
// }
//
// //end of IIFE
//  }());


$(function() {

  let feedData = [
    {id: 'newsapi', key: '69565f54b6c94a02b92830b2a8452177', feedUrl: 'http://newsapi.org/v1/articles'},
    {id: 'dailywtf', key: '', feedurl: 'http://thedailywtf.com/api/articles/random'}
  ];


  const newsApiUrl = 'newsapi.org/v1/articles?source=the-next-web';
  const newsApiKey = '69565f54b6c94a02b92830b2a8452177';

  function makeUrl(url, apikey){
    let outPut = "";
    outPut += "https://" + url;
    outPut += "&apiKey=" + apikey;
    return outPut;
  }





$.ajax(

    makeUrl(newsApiUrl, newsApiKey),

    {
    // url: makeUrl(newsApiUrl, newsApiKey, 'source=the-next-web'),
    context: document.body,
    beforeSend: function(){
      $('#popUp').removeClass('hidden');
    },
    complete: function(){
      $('#popUp').addClass('hidden');
    }
  })
    .done(function(response) {
    let articles = response.articles;
    console.log(articles);
    let sectionContainer = $('#main');
    $(articles).each(function(articles) {
      let article = `
      <article class="article" data-url="${this.url}" data-headline="${this.title}" data-description="${this.description}" >

        <section class="featuredImage">
          <img src="${this.urlToImage}" alt="" />
        </section>

        <section class="articleContent">
          <a href="${this.url}"><h3>${this.title}</h3></a>
          <p class="hidden">${this.description}</p>
          <h6>Lifestyle</h6>
        </section>

        <section class="impressions">
          526
        </section>
        <div class="clearfix"></div>
      </article>
      `;
      sectionContainer.append(article);
    });


    $('.article').on('click', function(e){
      e.preventDefault();
      $('#popUp').removeClass('hidden loader');
      let container = $('#popUp .container');

      container.text('');

      let url = e.currentTarget.dataset.url;
      let headline = e.currentTarget.dataset.headline;
      let text = e.currentTarget.dataset.description;

      let popArt = `<h1> ${headline} </h1>
        <p>
          ${text}
        </p>
        <a href="${url}" class="popUpAction" target="_blank">Read more from source</a>`;

        $('.closePopUp').on('click', function(e){
          $('#popUp').addClass('hidden loader');
        });
      container.append(popArt);


    });




  })
});
