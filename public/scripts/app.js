/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from tweets.json

const MAXCHARS = 140;

function escape(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(tweetData) {
  return (
    `<article class="tweet">
      <header>
        <img class="avatar" src="${tweetData.user.avatars.regular}">
        <h2>${tweetData.user.name}</h2>
        <span>${tweetData.user.handle}</span>
      </header>
      <article>
        ${escape(tweetData.content.text)}
      </article>
      <footer>
        <span>${moment(tweetData.created_at).fromNow()}</span>
        <div class="icons">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>`
  );
}

function renderTweets(tweets) {
  let tweetsStr = tweets.reverse().map(createTweetElement).join('');
  $("#tweet-container").prepend($(tweetsStr));
}

function submitTweet(newTweet) {
  $.post("/tweets", newTweet)
  .done((res) => {
    $("#new-tweet form").trigger("reset");
    loadTweets();
  })
  .fail((err) => {
    console.error(err);
  });
}

function loadTweets() {
  $.get("/tweets")
  .done((res) => {
    renderTweets(res);
  })
  .fail((err) => {
    console.error(err);
  });
}

$(document).ready(function() {
  loadTweets();
  let tweetText = $("#new-tweet textarea");

  $("input").on("click", (ev) => {
    ev.preventDefault();
    $("#new-tweet p").remove();
    let newTweet = $("#new-tweet form");

    if (!tweetText.val()) { // no tweet text
      newTweet.append("<p>Please enter some text into the box above!</p>");
    } else if (tweetText.val().length >= MAXCHARS) { // tweet too long
      newTweet.append("<p>Your tweet exceeds the maximum number of characters!</p>");
    } else {
      submitTweet(newTweet.serialize());
    }
  });

  $("#compose").on("click", (ev) => {
    $("#new-tweet").slideToggle();
    tweetText.focus();
  });

});