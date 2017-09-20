$(document).ready(function() {
  $("#new-tweet textarea").on("keyup", function(event) {
    let remainingChars = MAXCHARS - $(this).val().length;
    const counter = $(this).parent().children(".counter");

    counter.text(remainingChars);
    if (remainingChars < 0) {
      counter.addClass("invalid");
    } else {
      counter.removeClass("invalid");
    }
  });
});