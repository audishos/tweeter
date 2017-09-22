/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAXCHARS = 140;

// escapes all characters in the given string
function escape(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// generates the html for a tweet object and returns it
function createTweetElement(tweetData) {
  return (
    `<article class="tweet" data-tweet-id="${tweetData._id}">
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
          <span class="likes-counter">${(tweetData.likes ? tweetData.likes : 0)}</span>
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>`
  );
}

// iterates through an array of tweets,
// sending them to the createTweetElement function,
// then appends it to the #tweet container on the page
function renderTweets(tweets) {
  let tweetsStr = tweets.reverse().map(createTweetElement).join('');
  $("#tweet-container").empty();
  $("#tweet-container").prepend($(tweetsStr));
}

// POSTs a serialized tweet to the /tweets route
function submitTweet(newTweet) {
  $.post("/tweets", newTweet)
  .done((res) => {
    $("#new-tweet form").trigger("reset");
    $("#new-tweet .counter").text(MAXCHARS);
    loadTweets();
  })
  .fail((err) => {
    console.error(err);
  });
}

// GETs the tweets from the /tweets route,
// then sends them to renderTweets to be displayed
function loadTweets() {
  $.get("/tweets")
  .done((res) => {
    renderTweets(res);
  })
  .fail((err) => {
    console.error(err);
  });
}

function likeTweet(tweetId) {
  $.ajax({ type: "PUT", url: `/tweets/${tweetId}/like` })
  .done((res) => {
    return;
  })
  .fail((err) => {
    console.error(err);
  });
}

function unlikeTweet(tweetId) {
  $.ajax({ type: "PUT", url: `/tweets/${tweetId}/unlike` })
  .done((res) => {
    return;
  })
  .fail((err) => {
    console.error(err);
  });
}

function userLogin(loginCredentials) {
  console.log(loginCredentials);
  $.post("/users/login", loginCredentials)
  .done((res) => {
    // update UI
  })
  .fail((err) => {
    console.error(err);
  });
}

$(document).ready(function() {
  loadTweets();
  const tweetTextArea = $("#new-tweet textarea");

  // event handler for the new tweet form
  $("#new-tweet input").on("click", (ev) => {
    ev.preventDefault();
    $("#new-tweet p").remove();
    const newTweet = $("#new-tweet form");
    const tweetText = tweetTextArea.val();

    if (!tweetText) { // no tweet text
      newTweet.append("<p>Please enter some text into the box above!</p>");
    } else if (tweetText.length >= MAXCHARS) { // tweet too long
      newTweet.append("<p>Your tweet exceeds the maximum number of characters!</p>");
    } else {
      submitTweet(newTweet.serialize());
    }
  });

  // event handler for the compose nav button
  $("#compose").on("click", (ev) => {
    $("#new-tweet").slideToggle();
    $("#login-form").slideUp();
    $("#register-form").slideUp();
    tweetTextArea.focus();
  });

  // event handler for the login nav button
  $("#login-btn").on("click", (ev) => {
    $("#login-form").slideToggle();
    $("#new-tweet").slideUp();
    $("#register-form").slideUp();
    $("#login-form input").first().focus();
  });

  // event handler for the register nav button
  $("#register-btn").on("click", (ev) => {
    $("#register-form").slideToggle();
    $("#new-tweet").slideUp();
    $("#login-form").slideUp();
    $("#register-form input").first().focus();
  });

  // event handler for clicking like
  $("#tweet-container").on("click", ".fa-heart", (ev) => {

    const selectedTweet = $(ev.target).closest(".tweet")
    const selectedTweetId = selectedTweet.data("tweet-id");
    const selectedLikesCounter = selectedTweet.find(".likes-counter");
    const currentLikesCount = Number(selectedLikesCounter.text());

    if (!selectedTweet.hasClass("liked")) { // add like
      likeTweet(selectedTweetId);
      selectedTweet.addClass("liked");
      selectedLikesCounter.text(currentLikesCount + 1);
    } else { // remove like
      unlikeTweet(selectedTweetId);
      selectedTweet.removeClass("liked");
      selectedLikesCounter.text(currentLikesCount - 1);
    }

  });

  // event handler for the login form
  $("#login-form .submit").on("click", (ev) => {
    ev.preventDefault();

    const user = $("#login-form .form-input input").first();
    const pass = $("#login-form .form-input input").last();

    $("#login-form form p").remove();

    if (!user.val() || !pass.val()) {
      $("#login-form form").append("<p>Please enter both an email address and a pasword!</p>")
    } else {
      const loginCredentials = $("#login-form form");
      userLogin(loginCredentials.serialize());
    }


  });

});