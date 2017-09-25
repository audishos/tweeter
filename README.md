# Tweeter Project

Tweeter is a simple, single-page Twitter clone.

This repository is the starter code for the project: Students will fork and clone this repository, then build upon it to practice their HTML, CSS, JS, jQuery and AJAX front-end skills, and their Node, Express and MongoDB back-end skills.

## Screenshots

![Desktop Screenshot](/screenshots/tweeter-desktop.png)
![Mobile Screenshot](/screenshots/tweeter-mobile.png)

## What's been added?

### Tweets
- The ability to compose and submit a tweet
- The ability to like tweets
- Persistance: Tweets and likes are saved to MongoDB and are reloaded whenever the app is restarted

### Users
- User registration
- User login
- Only logged in users can tweet
- Only logged in users can like tweets

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Install MongoDB and start it using the `mognod` command.
4. Create the database "tweeter" with the collections "tweets" and "users"
5. Seed the "tweets" collection with the data from `/server/data-files/initial-tweets.json`
6. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
7. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Express
- Node 5.10.x or above
- BCrypt
- Body Parser
- Chance
- Cookie Session
- DotEnv
- md5
- MongoDB
- node-sass-middleware
