/*
  GA SF JSD6
  Jules Forrest
  Please add all Javascript code to this file.
*/

$('#search').click(function(){
  $(this).toggleClass('active');
});

$('#main').on('click', '.article', function(){
  $('#popUp').removeClass('hidden loader');
  var headline = $(this).find('h3').text();
  $('#popUp').find('h1').text(headline);
  debugger
  var description = $(this).data("popUpData").description;
  $('#popUp').find('p').text(description);
  var url = $(this).data("popUpData").url;
  $('#popUp').find('a').attr("href", url);
});

$('.closePopUp').click(function(){
  $('#popUp').addClass('hidden');
});

var createArticleListing = function(title, image, category, impressions) {
  return `<article class="article"><section class="featuredImage">
    <img src="${image}" alt="" />
  </section>
  <section class="articleContent">
      <a href="#"><h3> ${title} </h3></a>
      <h6>${category}</h6>
  </section>
  <section class="impressions">
    ${impressions}
  </section>
  <div class="clearfix"></div></article>`;
}


$.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json", function(results){
  console.log(results);
  results.data.feed.forEach(function(result){
    var newArticle = createArticleListing(result.content.title);
    newArticle = $(newArticle).data( "popUpData", { description: result.content.description, url: result.content.url } );
    $("#main").append(newArticle);
  })
})
