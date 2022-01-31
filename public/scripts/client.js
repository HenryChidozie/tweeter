/* eslint-disable no-undef */

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


//Escape function to prevent XSS for tweet element created as a string literal
const escape = function(str) {
  let tweetArticle = document.createElement("tweet-article");
  tweetArticle.appendChild(document.createTextNode(str));
  return tweetArticle.innerHTML;
};

//Helper function set timeout for error messages
const popError = function() {
  $(".error").delay(1000).slideUp("slow");
};

// Returning tweet <article> when doc is ready
$(document).ready(() => {
  //Hide error message by default
  $(".error").hide();

  //Setting toggle button on NAV bar
  $(".fas.fa-angle-double-down ").on("click", (event) => {
    $(".incoming-tweet").toggle("slow");
    $(".textarea").focus();
  });

  //Extract each data OBJECT from the data ARRAY
  const renderTweets = function(tweets) {
    $("#tweets-container").empty();
    for (const item of tweets) {
      // loops through tweets
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container
      const tweet = createTweetElement(item);
      $("#tweets-container").prepend(tweet);
    }
  };
  
  // Pass the data OBJECT that extracted by renderTweets function to below so each tweet will be reflected on the browser
  const createTweetElement = function(tweetData) {
    const name = tweetData.user.name;
    const avatars = tweetData.user.avatars;
    const tweetHandle = tweetData.user.handle;
    const tweetContent = tweetData.content.text;
    const tweetCreated = timeago.format(tweetData.created_at);

    let tweetHtml = `       
             <article class="tweet-article">
               <header class="tweet-header">
                 <div class="display-pic-name">
                   <img width=50px height=50px src="${escape(avatars)}"> 
                   <h2 class="tweeter-name">${escape(name)}</h2>
                 </div>
                   <h2 class="hastag-name">${escape(tweetHandle)}</h2>
               </header>
               <div class="tweet-body">
                 <p>
                   ${escape(tweetContent)}
               </div>
               <footer class="tweet-footer">
                 <p>
                   ${escape(tweetCreated)}
                 </p>
                 <span class="footer-icons">
                   <i class="fas fa-flag" aria-hidden="true"></i>&nbsp
                   <i class="fas fa-retweet" aria-hidden="true"></i>&nbsp
                   <i class="fas fa-heart" aria-hidden="true"></i>&nbsp
                 </span>
               </footer>
             </article>
      `;
    return tweetHtml;
  };
  

  //Add event listener for for submission & prevent default behavior
  const $incomingTweet = $(".incoming-tweet");
  $incomingTweet.on('submit',function(event) {
    event.preventDefault();

    //Serialize raw data input in the form (Compose Tweet box)
    const formDataString = $(this).serialize();
    
    //Form validation on character counts to trigger corresponding error message
    const tweetLength = $(".textarea").val().length;
    
    if (tweetLength === 0) {
      $("#0characters").slideDown("slow", popError);
    } else if (tweetLength > 140) {
      $("#tweet-too-long").slideDown("slow", popError);
    } else {
      $.ajax({
        method: "POST",
        url: "/tweets",
        data: formDataString,
        success: function() {
          $(".textarea").val("");
          $(".counter").html(140);
          $("#tweets-container").empty();
          loadTweets();
        }
      });
    }
  });
  // Function for fetching tweets from "/tweets" page
  const loadTweets = function() {
    $.ajax({
      method: "GET",
      url: "/tweets",
      data: "json",
      success: function(data) {
        renderTweets(data);
      }
    });
  };
  loadTweets();
});

$(".new-tweet").hide();
$(".nav-actions").on("click", function() {
  $(".new-tweet").slideToggle();
  $("textarea").focus();
});
