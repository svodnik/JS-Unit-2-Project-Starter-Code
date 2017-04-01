/*
  GA SF JSD6
  Jules Forrest
  Please add all Javascript code to this file.
*/

var createArticleListing = function(title, image, category, impressions, timestamp, publication) {
  return `<article class="article" data-date="${timestamp}" data-pub="${publication}"><section class="featuredImage">
    <img src="${image}" alt="" />
  </section>
  <section class="articleContent">
      <a href="#"><h3> ${title} </h3></a>
      <h6 class="category">${category}</h6>
  </section>
  <section class="impressions">
    ${impressions}
  </section>
  <div class="clearfix"></div></article>`;
}

$(function() {
  console.log("hi");
  $('#popUp').removeClass('hidden');

  $.get("https://accesscontrolalloworiginall.herokuapp.com/http://content.guardianapis.com/search?show-fields=thumbnail%2CtrailText%2Cwordcount&api-key=e8a00826-f3d6-4965-a89b-16ad2066bfa4", function(results){
    console.log(results);
    results.response.results.forEach(function(result){
      var newArticle = createArticleListing(result.webTitle, result.fields.thumbnail, result.sectionName, result.fields.wordcount, result.webPublicationDate, "guardian");
      newArticle = $(newArticle).data( "articleData", { description: result.fields.trailText, url: result.webUrl } );
      $("#main").append(newArticle);

    })
  })

  $.get("http://api.nytimes.com/svc/topstories/v2/home.json?api-key=2999869bd86b4da48852d255f65250ff", function(results){
    console.log(results);
    results.results.forEach(function(result){
      var newArticle = createArticleListing(result.title, result.multimedia[0].url, result.section, result.abstract.length, result.published_date, "nyt");
      newArticle = $(newArticle).data( "articleData", { description: result.abstract, url: result.url } );
      $("#main").append(newArticle);
      // console.log(newArticle.data("articleData").timestamp);
    })
  })

  $.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json", function(results){
    console.log(results);
    results.data.feed.forEach(function(result){
      var newArticle = createArticleListing(result.content.title, result.content.media.images[0].url, result.content.tags[0].name, result.digg_score, result.date_published, "digg");
      newArticle = $(newArticle).data( "articleData", { description: result.content.description, url: result.content.url } );
      $("#main").append(newArticle);
      // console.log(newArticle.data("articleData").timestamp);
    })
  })

  $('#popUp').addClass('hidden');

});

$('#search').click(function(){
  $(this).toggleClass('active');
});

$('#main').on('click', '.article', function(){
  $('#popUp').removeClass('hidden loader');
  var headline = $(this).find('h3').text();
  $('#popUp').find('h1').text(headline);
  var description = $(this).data("articleData").description;
  $('#popUp').find('p').text(description);
  var url = $(this).data("articleData").url;
  $('#popUp').find('.popUpAction').attr("href", url);
});

$('.closePopUp').click(function(){
  $('#popUp').addClass('hidden');
});

$('#main').on('click', '.article', function(){
  $('#popUp').removeClass('hidden loader');
  var headline = $(this).find('h3').text();
  $('#popUp').find('h1').text(headline);
  var description = $(this).data("articleData").description;
  $('#popUp').find('p').text(description);
  var url = $(this).data("articleData").url;
  $('#popUp').find('.popUpAction').attr("href", url);
});

$('#nyt').on('click', function(){
  $("#main").find(`[data-pub="nyt"]`).removeClass('hidden');
  $("#main").find(`[data-pub="guardian"]`).addClass('hidden');
  $("#main").find(`[data-pub="digg"]`).addClass('hidden');
});

$('#guardian').on('click', function(){
  $("#main").find(`[data-pub="guardian"]`).removeClass('hidden');
  $("#main").find(`[data-pub="nyt"]`).addClass('hidden');
  $("#main").find(`[data-pub="digg"]`).addClass('hidden');
});

$('#digg').on('click', function(){
  $("#main").find(`[data-pub="digg"]`).removeClass('hidden');
  $("#main").find(`[data-pub="nyt"]`).addClass('hidden');
  $("#main").find(`[data-pub="guardian"]`).addClass('hidden');
});
