// GA JS-SF-8 Matt Jones

// LOADING THE PAGE
// While the page is loading...
$(window).load(function () {
    // show the #popUp and hide the .closePopUp button
    $('#popUp').show().removeClass('hidden');
    $('.closePopUp').hide();

    //Create an empty array for all the articles
    let newsArray = [];

    // Create a function to churn out articles from the array
    function articleCreation(array) {
        // Clear whatever was in #main
        $('#main').html('');
        // For every article in the array passed through, make the article html
        for (let i = 0; i < array.length; i++) {
            let newArticle = $(`
                <article class="article">
                    <section class="featuredImage">
                        <img src="${array[i].urlToImage}" alt="" />
                    </section>
                    <section class="articleContent">
                        <a href="#"><h3>${array[i].title}</h3></a>
                        <h6>${array[i].author}</h6>
                    </section>
                    <!-- <section class="impressions">
                        526
                    </section> -->
                    <div class="clearfix"></div>
                </article>
            `);
            // Add that html to #main
            $('#main').append(newArticle);

            // ARTICLE PREVIEW UI
            // Show #popUp when you click on an a element of one of the articles
            $(newArticle).on('click', function() {
                $('#popUp').show().removeClass('loader hidden');
                $('.closePopUp').show();
                // Replace the information in #popUp with the information from each article
                $('#popUp .container h1').text(array[i].title)
                $('#popUp .container p').text(array[i].description);
                $('#popUp .container a').attr("href", array[i].url);
                // Change the text of the "Read more" button based on the news source
                if (array[i].url.startsWith("http://www.breitbart.com")) {
                    $('#popUp .container a').text("Read more from Breitbart");
                } else if (array[i].url.startsWith("https://www.buzzfeed.com")) {
                    $('#popUp .container a').text("Read more from Buzzfeed");
                } else {
                    $('#popUp .container a').text("Read more from The New York Times");
                };
            });

            // Hide #popUp when you click on .closePopUp
            $('.closePopUp').on('click', function() {
                $('#popUp').hide();
            });        
        };
    };

    // Create a function to sort the newsArray chronologically
    function sortedArray(response) {
        if (newsArray.length === 30) {
            newsArray.sort(function(a,b) {
                if (a.publishedAt > b.publishedAt) {
                    return -1;
                } else {
                    return 1;
                };
            });
            console.log(newsArray);
            // Run the above articleCreation function with the articles in the correct order
            articleCreation(newsArray);
            $('#popUp').hide();
        };
    };

    // Create a function to filter the page by news source
    function filterPage(x,y) {
        let filteredArray = newsArray.filter(function(a) {
            return a.url.startsWith(x);
        })
        $('#main').html('');
        articleCreation(filteredArray);
        $('span').text(y);
    }

    // Create a function to search the page based on user input
    function searchPage(string) {
        let searchedArray = newsArray.filter(function(a) {
            return a.title.includes(string);
        })
        $('#main').html('');
        articleCreation(searchedArray);
    }
    
    // When finished loading, get rid of the old #main example articles
    $('#main').html('');
 
    // GET REQUESTS
    // Get request to Breitbart News
    $.get('https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v1/articles?source=breitbart-news&sortBy=top&apiKey=0727657a13f44aa09df55289aef50bc6', function(response) {
        if (response.status === "ok") {
            console.log(response);
            $.merge(newsArray, response.articles);
            sortedArray(response); 
        } else {
            alert("Oh no! You cannot access data from Breitbart")
        };
        
    });

    // Get request to Buzzfeed
    $.get('https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v1/articles?source=buzzfeed&sortBy=top&apiKey=0727657a13f44aa09df55289aef50bc6', function(response) {
        if (response.status === "ok") {
            console.log(response);
            $.merge(newsArray, response.articles);
            sortedArray(response); 
        } else {
            alert("Oh no! You cannot access data from Buzzfeed")
        };
    });

    // Get request to The New York Times
    $.get('https://accesscontrolalloworiginall.herokuapp.com/https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=top&apiKey=0727657a13f44aa09df55289aef50bc6', function(response) {
        if (response.status === "ok") {
            console.log(response);
            $.merge(newsArray, response.articles);
            sortedArray(response); 
        } else {
            alert("Oh no! You cannot access data from The New York Times")
        }; 
    });


    // SOURCES DROP DOWN UI
    // Change the text in the drop down to the three news sources
    $('.otherList li:first-child a').text("Breitbart News");
    $('.otherList li:nth-child(2) a').text("Buzzfeed");
    $('.otherList li:nth-child(3) a').text("The New York Times");

    // Run the filterPage function when the user clicks on the news sources
    $('.otherList li:first-child a').on('click', function() {
        filterPage("http://www.breitbart.com", "Breitbart");

    });

    $('.otherList li:nth-child(2) a').on('click', function() {
        filterPage("https://www.buzzfeed.com", "Buzzfeed");
    });

    $('.otherList li:nth-child(3) a').on('click', function() {
        filterPage("https://www.nytimes.com", "The New York Times");
    });


    // Show all articles from all the sources in #main when the user clicks on #home
    $('#home').on('click', function() {
        articleCreation(newsArray);
        $('span').text("All");
    });



    // SEARCH BUTTON UI
    // When the user clicks on the search icon (#search a)
    $('#search a').on('click', function() {
        // Show/toggle the search input field
        $('#search').toggleClass('active');
        // Hide/toggle the sources dropdown menu
        $('.bigList').toggle();
        // Clear the input field
        $('#search input').val('');
        // Create a boolean variable for below
        let $currentClass = $('#search').hasClass('active');
        console.log($currentClass);

        // If the search field is .active
        if ($currentClass) {
            // When the user presses Enter
            $(document).keypress(function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    // Hide the search input field
                    $('#search').removeClass('active');
                    // Show the sources dropdown menu
                    $('.bigList').show();
                };
            });
        };

        // Run the searchPage function when the user presses any key
        $(document).keypress(function() {
            let userInput = $('input').val();
            searchPage(userInput);
        });
    });


// Only show the first 20 articles   

// Add infinite scrolling

})