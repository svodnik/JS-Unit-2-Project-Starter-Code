/*
  GA SF JSD6
  Jules Forrest
  Please add all Javascript code to this file.
*/

var createArticleListing = function(title, image, category, impressions, timestamp, publication) {
  timestamp = new Date(timestamp).getTime();
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
  $('#popUp').removeClass('hidden');

  var guardianRequest = $.get("https://accesscontrolalloworiginall.herokuapp.com/http://content.guardianapis.com/search?show-fields=thumbnail%2CtrailText%2Cwordcount&api-key=e8a00826-f3d6-4965-a89b-16ad2066bfa4");
  var nytRequest = $.get("http://api.nytimes.com/svc/topstories/v2/home.json?api-key=2999869bd86b4da48852d255f65250ff");
  var diggRequest = $.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json");

  $.when(guardianRequest, nytRequest, diggRequest).done(function(guardianResponse, nytResponse, diggResponse){

    if (guardianResponse){
      if (guardianResponse[0].response == null){
        alert('This feed could not be loaded');
      } else {
        console.log(guardianResponse);
        guardianResponse[0].response.results.forEach(function(result){
          var newArticle = createArticleListing(result.webTitle, result.fields.thumbnail, result.sectionName, result.fields.wordcount, result.webPublicationDate, "guardian");
          newArticle = $(newArticle).data( "articleData", { description: result.fields.trailText, url: result.webUrl } );
          $("#main").append(newArticle);
        })
      }
    }

    if (nytResponse){
      if (nytResponse[0].results == null){
        alert('This feed could not be loaded');
      } else {
        console.log(nytResponse);
        nytResponse[0].results.forEach(function(result){
          var imgUrl = result.multimedia[0] ? result.multimedia[0].url : null;
          var newArticle = createArticleListing(result.title, imgUrl, result.section, result.abstract.length, result.published_date, "nyt");
          newArticle = $(newArticle).data( "articleData", { description: result.abstract, url: result.url } );
          $("#main").append(newArticle);
        })
      }
    }

    if (diggResponse){
      if (diggResponse[0].data == null){
        alert('This feed could not be loaded');
      } else {
        console.log(diggResponse);
        diggResponse[0].data.feed.forEach(function(result){
          var newArticle = createArticleListing(result.content.title, result.content.media.images[0].url, result.content.tags[0].name, result.digg_score, (result.date_published*1000), "digg");
          newArticle = $(newArticle).data( "articleData", { description: result.content.description, url: result.content.url } );
          $("#main").append(newArticle);
        })
      }
    }

    var $articleListContainer = $('#main');
    var $articleList = $articleListContainer.children('article');
    $articleList.sort(function(a,b){
      var ad = a.getAttribute('data-date');
      var bd = b.getAttribute('data-date');

      if(ad > bd) {
        return 1;
      }
      if(ad < bd) {
        return -1;
      }
      return 0;
    });

    $articleList.detach().appendTo($articleListContainer);
    $('#popUp').addClass('hidden');
  }).fail(function() {

});

});

$('#search img').click(function(){
  $(this).parents('#search').toggleClass('active');
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

var pubToggle = function(pub, pubName){
  $('#popUp').removeClass('hidden');
  $('#currentPub').text(pubName);
  $("#main").find(`article[data-pub="${pub}"]`).removeClass('hidden');
  $("#main").find(`article[data-pub!="${pub}"]`).addClass('hidden');
  $('#popUp').addClass('hidden');
};

$('#sourceList li').on('click', function(){
  var pub = $(this).children('a').attr('id');
  var pubName = $(this).text();
  pubToggle(pub, pubName);
});

$('#logo').on('click', function(){
  $('#currentPub').text("All");
  $("#main").find('.article').removeClass('hidden');
})
