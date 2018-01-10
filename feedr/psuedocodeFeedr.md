** GET JSON STRING **

  API KEY = acd435a3c73c4530a3dc729d9a356729

  const vergeNews [sources = the-verge]
  const polygonNews [sources = polygon]
  const wiredNews  [sources = wired]

  const  url= 'https://newsapi.org/v2/top-headlines?' +
            'sources=NEWS-OUTLET' +
            'apiKey=API_KEY';

  var req = new Request(url);

  fetch(req)
      .then(function(response) {
          if there is a response:
            console.log(response.json());
            function to convert object to string
            function to attach articles to the DOM
          else:
            get error image
            get error message
            append both to page
      })

** ATTACHING ARTICLES TO THE DOM **
0. convert object to array
1. forEach loop
    a. article container: create article with class article
    b. image: create section with featuredImage class
        i. get image url from api content & add to img src
        ii. append section to article
    c. title/link/type: create section with class articleContent
        i. get article url & add to a href
        ii. get article title & assign to h3
        iii. get tag/type/date? of article and add to h6 ???
        iv. append section to article
    d. rating: create section with class impressions
        i. get page views & add to section
    e. clearfix: add div with class clearfix
    f. append article to container

** ON CLICK FUNCTIONS **
- on dropdown menu click
    remove all
    attach articles from one object
- on home clicks
    add everything
    sort by date (top is most recent)
- on article click
      remove class hidden from id popUp
      get info from section clicked
      append that info to the pop-up section
    close popup by adding hidden on click closePopUp
      remove content from popup section
