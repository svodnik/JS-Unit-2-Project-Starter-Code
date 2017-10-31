/*
  Please add all Javascript code to this file.
  GA JS-SF-8 Ian
*/

const API_KEY_NYT = "49384f9a1a4f4a30803f51d2ff1a26f0";
const API_KEY_NPI = "fb5d233e64d94275b9021245ac114ed0";
const ARTICLES_NYT = {};
const ARTICLES_WPO = {};
const ARTICLES_BB = {};

function nytSaveData(array) {
  for (var article in array) {
    var key = array[article].slug_name;
    ARTICLES_NYT[key] = array[article];
  }
}

function npiSaveData(array, source) {
  for (var article in array) {
    var key = array[article].publishedAt;
    source[key] = array[article];
  }
}

function initSearch() {
  $("#search").on("click", function() {
    $(this).toggleClass("active");
  });
}

function initPopup() {
  $(".closePopUp").on("click", function() {
    $("#popUp").addClass("hidden");
  });
}

function initPopupLinks(source) {
  $("article a").on("click", function(event) {
    event.preventDefault();
    showPopup($(this).attr("href"), source);
  });
}

function showLoaderMain() {
  $("#main").html("<div class=\"loader\"></div>");
}

function initHome() {
  $("#home").on("click", function(event) {
    event.preventDefault();
    showLoaderMain();
    getNYT();
  });
}

function initNYT() {
  $("[data-filter=nyt]").on("click", function() {
    showLoaderMain();
    getNYT();
  });
}

function initWPO() {
  $("[data-filter=wpo]").on("click", function() {
    showLoaderMain();
    getWPO();
  });
}

function initBB() {
  $("[data-filter=bb]").on("click", function() {
    showLoaderMain();
    getBB();
  });
}

function initPage() {
  initSearch();
  initPopup();
  initHome();
  initNYT();
  initWPO();
  initBB();
}

function showPopup(slug, source) {
  var article = source[slug];
  $("#popUp").removeClass("loader hidden");
  $("#popUp h1").html(article.title);
  if (source == ARTICLES_NYT) {
    $("#popUp p").html(article.abstract);
  } else {
    $("#popUp p").html(article.description);
  }
  $("#popUp .popUpAction").attr("href", article.url);
}

function nytDisplayArticles(articles) {
  var html = `${articles.map(article =>
    `<article class='article'>
      <section class='featuredImage'>
        <img src='${article.thumbnail_standard ? `${article.thumbnail_standard}`: `images/article_placeholder_1.jpg`}' alt='' />
      </section>
      <section class='articleContent'>
        <a href=${article.slug_name}><h3>${article.title}</h3></a>
        <h6>${article.section}</h6>
      </section>
      <div class='clearfix'></div>
    </article>`
  ).join("")}`;
  $("#main").empty().append(html);
  initPopupLinks(ARTICLES_NYT);
}

function npiDisplayArticles(articles, source) {
  var html = `${articles.map(article =>
    `<article class='article'>
      <section class='featuredImage'>
        <img src='${article.urlToImage ? `${article.urlToImage}`: `images/article_placeholder_1.jpg`}' alt='' />
      </section>
      <section class='articleContent'>
        <a href=${article.publishedAt}><h3>${article.title}</h3></a>
        <h6></h6>
      </section>
      <div class='clearfix'></div>
    </article>`
  ).join("")}`;
  $("#main").empty().append(html);
  initPopupLinks(source);
}

function getNYT(numArticles) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: `http://api.nytimes.com/svc/news/v3/content/all/all.json?limit=${numArticles}&api-key=${API_KEY_NYT}`,
    method: "GET",
    // success: function(msg) {},
    error: function(msg) {
      alert("Oops. That did not go as planned. Refresh the page and try again?");
    },
    // complete: function(msg) {}
  }).done(function (response) {
    var articles = response.results;
    nytSaveData(articles);
    nytDisplayArticles(articles);
  });
}

function getWPO() {
  $.ajax({
    async: true,
    crossDomain: true,
    url: `https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v1/articles?source=the-washington-post&apiKey=${API_KEY_NPI}`,
    method: "GET",
    // success: function(msg) {},
    error: function(msg) {
      alert("Oops. That did not go as planned. Refresh the page and try again?");
    },
    // complete: function(msg) {}
  }).done(function (response) {
    var articles = response.articles;
    npiSaveData(articles, ARTICLES_WPO);
    npiDisplayArticles(articles, ARTICLES_WPO);
  });
}

function getBB() {
  $.ajax({
    async: true,
    crossDomain: true,
    url: `https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v1/articles?source=bloomberg&apiKey=${API_KEY_NPI}`,
    method: "GET",
    // success: function(msg) {},
    error: function(msg) {
      alert("Oops. That did not go as planned. Refresh the page and try again?");
    },
    // complete: function(msg) {}
  }).done(function (response) {
    var articles = response.articles;
    npiSaveData(articles, ARTICLES_BB);
    npiDisplayArticles(articles, ARTICLES_BB);
  });
}

initPage();
getNYT();
