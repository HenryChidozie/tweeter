
//this function will implement the character counter
$(document).ready(function() {
  console.log(this);
  $(".textarea").on("input", function(event) {
    const tweetLength = event.target.value.length;
    const textLimit = 140;
    console.log(this);

    $(".counter").text(textLimit - tweetLength);
    if (tweetLength > textLimit) {
      $(".counter").css("color", "red");
    } else {
      $(".counter").css("color", "black");
    }
  });
});