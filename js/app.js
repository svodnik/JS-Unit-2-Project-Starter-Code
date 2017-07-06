/*
GA JS-SF-7
Kesha Seeley
*/

// Pseudocode:
// 1. Pull feeds from outside source.
// 2. Filter between publications through the dropdown on the header menu.
// 3. Clicking on the articles will load a pop up with more info.
// 4. User can dismiss the additional info or go to the referenced article.
// 5. After we pull from the respective feed APIs, we will toggle the appropriate classes and content for the provided site architecture.

/* Proxy server to filter API requests:
$.get("https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json", function(results){
console.log(results);
results.data.feed.forEach(function(result){
$("ul").append("<li>"+result.content.title+"</li>")
})
});
*/

$(document).ready(function() {

  addHuffPo();
  addGuardian();
  filterBySearch();
  closePopUp();

  $('#guardianFilter').on('click', function (event) {
    event.preventDefault();
    filterGuardian();
  });

  $('#huffPoFilter').on('click', function (event) {
    event.preventDefault();
    filterHuffPo();
  });

  $('#feedrButton').on('click', function (event){
    event.preventDefault();
    filterByTime();
  });

  $('#search').on('click', function (event) {
    event.preventDefault();
    $('#search').addClass("active");
  });

});

var addArticleToPage = function(url, title, sectionName, publicationDate, description, imageUrl){
  //console.log(url, title, sectionName, publicationDate, description, imageUrl);
  // clone the first instance of class="article"
  var $articleClone = $('.article').first().clone();
  // remove id="hidden-template"
  $articleClone.removeAttr('id');
  // grab popup block and remove class="hidden"
  $($articleClone).click(function(event){
    event.preventDefault();
    $('#popUp').removeClass('hidden');
    var $popUpContent = $('#popUpContent').children();
    $($popUpContent[0]).html('<h1>' + title + '</h1>');
    $($popUpContent[1]).html('<p>' + description + '</p>');
    $($popUpContent[2]).attr('href', url);
    //console.log($popUpContent);
  })
  if (imageUrl) {
    var $featuredImage = $articleClone.children()[0];
    // to use API image of article:
    $($featuredImage).find("img").attr('src', imageUrl);
  }
  // get the content w/in the html
  var $articleContent = $articleClone.children()[1];
  // get the href and h6
  var $articleContentChildren = $($articleContent).children();
  // to avoid duplicate href, change only the attribute of selected object
  $($articleContentChildren[0]).attr('href', url);
  // change title
  $($articleContentChildren[0]).html('<h3 class="articleTitle">' + title + '</h3>');
  // change section name
  $($articleContentChildren[1]).html(sectionName);
  var articleDate = $($articleClone.children()[2]).html(publicationDate);
  $('#main').append($articleClone);
  //console.log($articleClone);
}

var closePopUp = function(){
  $('.closePopUp').click(function(event){
      event.preventDefault();
      $('#popUp').addClass('hidden');
  })
}

var addGuardian = function(){
  // // Guardian API
  $.ajax({
    url: "https://content.guardianapis.com/search?api-key=2f0d0817-d151-477d-891f-2f97fa4961ee",
    data: {
      format: "json"
    },

    success: function(data) {
      //console.log(data.response);
      var articleSort = data.response.results.sort(function(a, b){
        return new Date(b.webPublicationDate) - new Date(a.webPublicationDate);
      })

      articleSort.forEach(function(newsStory) {
        addArticleToPage(newsStory.webUrl, newsStory.webTitle, newsStory.sectionName, newsStory.webPublicationDate, "", "");
      })
    }
  })
}

var addHuffPo = function(){
  //  News API
  $.ajax({
    url: "https://newsapi.org/v1/articles?source=the-huffington-post&sortBy=top&apiKey=52a18f8747024a0489c4eacf5be95e32",
    data: {
      format: "json"
    },

    success: function(data) {
      //console.log(data);

      var articleSort = data.articles.sort(function(a, b){
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      })
      //console.log(articleSort);
      articleSort.forEach(function(newsStory) {
        addArticleToPage(newsStory.url, newsStory.title, "", newsStory.publishedAt, newsStory.description, newsStory.urlToImage);
      })
    }
  })
}

var filterByTime = function(){
  // grab all the children of id="main" except for the first child (hidden template)
  var $mainChildren = $('#main').children().not(':first');
  // create a jquery function to sort by newest date
  $mainChildren.sort(function(a,b){
    a = $(a).children('.articleDate').html();
    b = $(b).children('.articleDate').html();
    return new Date(b) - new Date(a);
  })
  // empty out the article content
  $('#main').children().not(':first').remove();
  // replace with the sorted order
  $($mainChildren).each(function(){
    $('#main').append(this);
  })
}

var filterBySearch  = function(){

  // var allRemoved = [];

  $('#searchBox').keyup(function(){

    var $allTitles = $('#main').children().not(':first');
    // get text from text box
    var input = $(this).val();
    // compares text from searchBox to articleTitle
    $($allTitles).each(function(){
      var $title = $(this).children();
      var $titleText = $($title[1]).children()[0];
      $titleText = $($titleText).text();
      // matches searchBox regardless of case
      if ($titleText.toLowerCase().indexOf(input) < 0) {
        // allRemoved.push(this);
        // console.log(allRemoved)
        $(this).remove();
      }
      // else if (allRemoved.sometitle.indexOf(input) >= 0) {
      //   #main.append
      // }
    })
  })

}


var filterGuardian = function(){
  $('#main').children().not(':first').remove();
  addGuardian();
}

var filterHuffPo = function(){
  $('#main').children().not(':first').remove();
  addHuffPo();
}
