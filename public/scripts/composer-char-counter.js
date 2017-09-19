$(document).ready(function() {
  $(".new-tweet").on("keyup", "textarea", function (event) {
    const MAXCHARS = 140;
    let remainingChars = MAXCHARS - $(this).val().length;

    $(".counter").text(remainingChars);
  });
});