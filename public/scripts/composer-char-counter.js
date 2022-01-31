/* eslint-disable no-undef */

//this function will implement the character counter
$(document).ready(function() {
  $(".textarea").on("input", function(event) {
    let tweetLength = $(this).val().length;
    const textLimit = 140;

    $(".counter").text(textLimit - tweetLength);
    if (tweetLength > textLimit) {
      $(".counter").css("color", "red");
    } else {
      $(".counter").css("color", "black");
    }
  });
});