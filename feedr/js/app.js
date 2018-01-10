/*
  GA-JS-SF-9
  Samantha Park
  Please add all Javascript code to this file.
*/
'use strict';

//define NEWS SOURCES
const allSource = 'sources= the-verge, polygon, wired&';
const vergeSource = 'sources=the-verge&';
const polygonSource = 'sources=polygon&';
const wiredSource = 'sources=wired&';

//ON HOMEPAGE load
window.addEventListener('load', function(){
  getHeadlines(allSource);
}, false);

//function to GRAB HEADLINES based on which NEWS SOURCE is selected
function getHeadlines(source){
  const  url= 'https://newsapi.org/v2/top-headlines?' +
            source + 'apiKey=acd435a3c73c4530a3dc729d9a356729';

  fetch(url).then(function(response) {
    if(response.ok) {
      return response.json();
    }else {
      console.log("There was a problem.");
      $('#main').val('');
      errorMessage();
    }
  }).then(function(data){
    //console.log(data);
    createArticle(data);
  });
}

//get NEWS SOURCES LINKS
const vergeFilter = $('#vergeButton');
const polygonFilter = $('#polygonButton');
const wiredFilter = $('#wiredButton');
const feedrHomeButton = $('#feedrHome');

//SELECT BY news sources
vergeFilter.on('click', function(){
    $('#main').empty();
    getHeadlines(vergeSource);
});

polygonFilter.on('click', function(){
    $('#main').empty();
    getHeadlines(polygonSource);
});

wiredFilter.on('click', function(){
    $('#main').empty();
    getHeadlines(wiredSource);
});

feedrHomeButton.on('click', function(){
    $('#main').empty();
    getHeadlines(allSource);
});

//FUNCTION to CONVERT OBJECT and CREATE ARTICLE BLOCKS and APPEND
function createArticle(data){
  const $articles = data.articles;
  console.log($articles);

  $.each($articles, function(){
    const $articleSection = $('<article>').addClass('article');

    const $imageSection = $('<section>').addClass('featuredImage');
    const $image = $('<img>').attr('src', this.urlToImage);
    $imageSection.append($image);
    $articleSection.append($imageSection);

    const $contentSection = $('<section>').addClass('articleContent');
    const $titleContent = $('<a>').attr('href', '#');
    const $titleLink = $('<h3>').text(this.title);
    $titleContent.append($titleLink);
    const $descriptionContent = $('<h6>').text(this.source.name);
    $contentSection.append($titleContent);
    $contentSection.append($descriptionContent);
    $articleSection.append($contentSection);

    const $impressions = $('<section>').addClass('impressions').text('526');
    $articleSection.append($impressions);

    const $clearfix = $('<div>').addClass('clearfix');
    $articleSection.append($clearfix);

    $('#main').append($articleSection);
  });
}

//ON CLICK show ARTICLE DETAILS
$('.articleContent a').on('click', function(event) {
  event.preventDefault();
  $titleToAdd = this.val();

  $('#popUp').removeClass('hidden');
  $('#popUp').removeClass('loader');

  const $closePopUp = $('<a>').attr('href', '#').addClass('closePopUp').text('X');
  $('#popUp').append($closePopUp);

  const $newContainer = $('<div>').addClass('container');

  const $titlePopUp = $('<h1>').val($titleToAdd);
  $newContainer.append($titlePopUp);

  const $descripPopUp = $('<p>').val();
  $newContainer.append($descripPopUp);

  const $goToArticle = $('<a>').attr({href: "", target: "_blank"}).addClass('popUpAction').text('READ MORE FROM SOURCE');
  $newContainer.append($goToArticle);

  $('#popUp').append($newContainer);
});

//CLOSE article window
$(".closePopUp").on('click', function(){
  $('#popUp').addClass('hidden');
  $('#containerPopUp').val('');
});

//LOADER function
// $('#popUp').removeClass('hidden').addClass('loader');
// $('.closePopUp').addClass('hidden');

//ERROR MESSAGE function
function errorMessage(){
  const $errorLoadingImg = $('<img>').attr('src', '../images/error_loading.jpg');
  const $errorText = $('<h1>').val('Sorry! We are unable to load these articles right now.');
  $('#main').append($errorLoadingImg);
}
