/*
 	GA JS-SF-9
 	Jonathan Kern
  	Please add all Javascript code to this file.
*/

'use strict';

// set up API functionality
const buzzFeedAPIKey = 'API_KEY';
const buzzFeedUrl = 'https://newsapi.org/v2/top-headlines?sources=buzzfeed&apiKey=' + buzzFeedAPIKey;
const buzzFeedRequest = new Request(buzzFeedUrl);

const guardianAPIKey = 'API_KEY';
const guardianUrl = 'http://content.guardianapis.com/search?show-fields=lastModified,headline,trailText,thumbnail&api-key=' + guardianAPIKey;
const guardianRequest = new Request(guardianUrl);

const nyTimesAPIKey = 'API_KEY';
const nyTimesUrl = 'http://api.nytimes.com/svc/topstories/v2/sports.json?api-key=' + nyTimesAPIKey;
const nyTimesRequest = new Request(nyTimesUrl);

let status;
let articles;
let title;
let description;
let tag;
let thumbnailUrl;
let imageUrl;
let publishDate;
let articleUrl;
let $newsSource;

const $newsSourceSpan = $('.newsSource');
const $main = $('#main');
const $popUpWrapper = $('#popUp');

function beginAll() {
	beginBuzzFeed();
	beginGuardian();
	beginNYTimes();
}

function beginBuzzFeed() {
	fetch(buzzFeedRequest).then(function(response) {
		if (response.ok) {
			// get status
			status = response.status;
			// console.log('BuzzFeed Status: ' + status);

			// pull data and parse json
			return response.json();
		} else {
			alert('there was a problem with the request');
		}
	}).then(function(data) {
		// console.log(data);
		$popUpWrapper.removeClass('loader');

		buzzFeedHandler(data);
	});
}

function beginGuardian() {
	fetch(guardianRequest).then(function(response) {
		if (response.ok) {
			// get status
			status = response.status;
			// console.log('Guardian Status: ' + status);
			// pull data and parse json
			return response.json();
		} else {
			alert('there was a problem with the request');
		}
	}).then(function(data) {
		// console.log(data);
		$popUpWrapper.removeClass('loader');

		guardianHandler(data);
	});
}

function beginNYTimes() {
	fetch(nyTimesRequest).then(function(response) {
		if (response.ok) {
			// get status
			status = response.status;
			// console.log('NY Times Status: ' + status);
			// pull data and parse json
			return response.json();
		} else {
			alert('there was a problem with the request');
		}
	}).then(function(data) {
		// console.log(data);
		$popUpWrapper.removeClass('loader');

		nyTimesHandler(data);
	});
}

function buzzFeedHandler(data) {
	// console.log('BuzzFeed');

	articles = data.articles;
	// console.log(articles);

	articles.forEach(function(article) {
		title = article.title;
		description = article.description;
		imageUrl = article.urlToImage;
		articleUrl = article.url;
		publishDate = article.publishedAt;
		tag = 'Top Headlines';

		return uiHandler(title, description, imageUrl, articleUrl, publishDate, tag);
	});
}

function guardianHandler(data) {
	// console.log('The Guardian');

	articles = data.response.results;
	// console.log(articles);

	articles.forEach(function(article) {
		title = article.fields.headline;
		description = article.fields.trailText;
		imageUrl = article.fields.thumbnail;
		articleUrl = article.webUrl;
		publishDate = article.fields.lastModified;
		tag = article.sectionName;

		return uiHandler(title, description, imageUrl, articleUrl, publishDate, tag);
	});
}

function nyTimesHandler(data) {
	console.log('NY Times');

	articles = data.results;
	// console.log(articles);

	articles.forEach(function(article) {
		title = article.title;
		description = article.abstract;
		imageUrl = article.multimedia[0].url;
		articleUrl = article.url;
		publishDate = article.published_date;
		tag = article.section;

		return uiHandler(title, description, imageUrl, articleUrl, publishDate, tag);
	});
}

function uiHandler(title, description, imageUrl, articleUrl, publishDate, tag) {
	// console.log('UI Stuff');

	const $articleWrapper = $('<article class="article">');
	const $thumbnailWrapper = $('<section class="featuredImage">');
	const $articleContentWrapper = $('<section class="articleContent">');
	const $impressionsWrapper = $('<section class="impressions">');
	const $clear = $('<div class="clearfix">');

	// create img element
	const $imageElement = $('<img>');
	// create source for img
	const $imageUrl = $imageElement.attr('src', imageUrl);

	// create heading elements
	const $link = $('<a href="#" class="openPopUp">');
	const $h3Element = $('<h3 class="articleTitle">');
	const $h6Element = $('<h6>');

	// convert publish date to human form
	const $convertPublishDay = publishDate.substr(5, 5);
	// console.log($convertPublishDay);
	const $convertPublishYear = publishDate.substr(0,4);
	const $convertPublishDate = $convertPublishDay + '-' + $convertPublishYear;
	// console.log($convertPublishDate);
	const $convertPublishTime = publishDate.substr(11, 5);
	// console.log($convertPublishTime);
	const $publishText = 'Published: ' + $convertPublishDate + '\n' + 'at ' + $convertPublishTime;

	// add to DOM
	//append img to thumbnail wrapper
	$thumbnailWrapper.append($imageElement);

	// append article to container
	$main.append($articleWrapper);

	// append sections to article
	$articleWrapper.append($thumbnailWrapper);
	$articleWrapper.append($articleContentWrapper);
	$articleWrapper.append($impressionsWrapper);
	$articleWrapper.append($clear);

	// append title to h3
	$h3Element.append(title);

	// append h3 to link
	$link.append($h3Element);

	// append to tag h6
	$h6Element.append(tag);

	// append headings to article content
	$articleContentWrapper.append($link);
	$articleContentWrapper.append($h6Element);

	// append publishDate to impressions
	$impressionsWrapper.append($publishText);

	// click article to open pop-up
	$articleWrapper.click(function() {
		// show popup
		$popUpWrapper.removeClass('hidden');

		const $popUpH1Element = $('#popUp .container h1');
		const $popUpPElement = $('#popUp .container p');
		const $popUpAElement = $('.popUpAction');
		const $popUpArticleUrl = $popUpAElement.attr('href', articleUrl);

		$popUpH1Element.append(title);
		$popUpPElement.append(description);
		$popUpAElement.append($popUpArticleUrl);

		// click handler closePopUp
		$('.closePopUp').click(function() {
			$popUpWrapper.addClass('hidden');
		});
	});
}

function clear() {
	// console.log('Reset everything!');
	$('#popUp .container').empty();
	$newsSourceSpan.empty();
	$main.empty();
}

$('.mainFeed').click(function() {
	clear();
	beginAll();
});

$('.buzzFeedSource').click(function() {
	clear();

	$newsSource = 'Buzzfeed';
	$newsSourceSpan.append($newsSource);

	beginBuzzFeed();
});

$('.guardianSource').click(function() {
	clear();

	$newsSource = 'The Guardian';
	$newsSourceSpan.append($newsSource);

	beginGuardian();
});

$('.nyTimesSource').click(function() {
	clear();

	$newsSource = 'The New York Times';
	$newsSourceSpan.append($newsSource);

	beginNYTimes();
});

// show all by default
beginAll();
