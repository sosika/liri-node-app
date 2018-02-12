// Import the key.
var twitterKeys = require("./keys.js");
var spotifyKeys = require("./keys.js");

// Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(spotifyKeys);

// Load the twitter npm
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'UR9hvK6bEd7z2QDtOISrRPZXo',
  consumer_secret: 'AXJFyVwJP9MXbR1TU8dvzGsYId4PRP4bzvs06GL2AnGqqQ8FjR',
  access_token_key: '960745240821841926-FCxogsXEOmNlfuD5SrQLA8Omlk9OWCu',
  access_token_secret: 'q7rWTi6k3YP2wLw0XxZwdUDFO9KaBJdm20bxFylhDa66q',
});

// Load the NPM Packages
var inquirer = require("inquirer");
var request = require("request");
var fs = require("fs");

// Take input from user.
inquirer.prompt([
    {
    type: "list",
    name: "input",
    message: "How can I help you?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
  	}
 ]).then(function(user) {

 	// my-tweets was selected
 	if (user.input === "my-tweets") {
	 	var params = {
      screen_name: 'SaijaiOsika',
      count: 20
    };

		client.get('statuses/user_timeline', params, function(error, tweets, response) {
   			if (!error) {
     			for (var i=0; i<tweets.length; i++) {
     				let date = new Date(tweets[i].created_at);
            console.log('Tweeted at: ', date.toLocaleString());
     				console.log(tweets[i].text + '\n');
     			}
     			
   			} else {
   				console.log('>>>> ERROR', error);
   			}
		});
 	} // End my-tweets

 	//  spotify-this-song was selected.
 	else if (user.input === "spotify-this-song") {

    // Take song input from user
 		inquirer.prompt([
		    {
			    type: "input",
			    name: "spotifyInput",
			    message: "Which song do you want to know about?",
		  	}
		]).then(function(song) {
			console.log('song.spotifyInput: ',song.spotifyInput);

      // If input is blank
      if (song.spotifyInput === "") {
          spotify.search({ type: 'track', query: 'The Sign Ace of Base' }, function(err, data) {
          // console.log(data);
            // console.log(JSON.stringify(data, null, 2)); 
            console.log("\nArtist: ",data.tracks.items[5].artists[0].name); 
            console.log("Album: ",data.tracks.items[5].album.name);
            console.log("Song's name: ",data.tracks.items[5].name);
            console.log("Preview link: ",data.tracks.items[5].preview_url + "\n");
          });
      }
			
      // If input is not blank
      else {
      spotify.search({ type: 'track', query: song.spotifyInput }, function(err, data) {

        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log("\nArtist: ",data.tracks.items[0].artists[0].name); 
        console.log("Album: ",data.tracks.items[0].album.name);
        console.log("Song's name: ",data.tracks.items[0].name);
        console.log("Preview link: ",data.tracks.items[0].preview_url + "\n");
        
      });
    };
    });
  } // End spotify-this-song

 	// movie-this was selected
 	else if (user.input === "movie-this") {

    inquirer.prompt([
        {
          type: "input",
          name: "movieInput",
          message: "Which movie do you want to know about?",
        }
    ]).then(function(movie) {
        console.log(movie);

        // If input is blank
          if (movie.movieInput === "") {
            console.log("Movie is blank. Therefore, you'll get Mr. Nobody:" + "\n");
            var queryUrl = "http://www.omdbapi.com/?t=Mr. Nobody&y=&plot=short&apikey=trilogy";
            request(queryUrl, function(error, response, body) {
              console.log("Title: " + JSON.parse(body).Title);
              console.log("Year: " + JSON.parse(body).Year);
              console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
              console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
              console.log("Country where movie was produced: " + JSON.parse(body).Country);
              console.log("Language: " + JSON.parse(body).Language);
              console.log("Plot: " + JSON.parse(body).Plot);
              console.log("Actors: " + JSON.parse(body).Actors + "\n");
            });
          }

        // If input in not blank
        else {
        var queryUrl = "http://www.omdbapi.com/?t=" + movie.movieInput + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {

          
          // If error
          if (error) {
            console.log('>>>> ERROR', error);
          }
          // If the request is successful
          else  {
            console.log("\n" + "Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where movie was produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors + "\n");
          };
          
        })
      }
    })
 	} // End movie-this

 	// do-what-it-says was selected.
 	if (user.input === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function(error, data) {

      if (error) {
        return console.log(error);
      }

      console.log(data);

      // Then split it by commas (to make it more readable)
      var dataArr = data.split(",");

      // We will then re-display the content as an array for later use.
      var command = dataArr[0];
      console.log(command);
      var input = dataArr[1];
      console.log(input);

      if (command === "my-tweets") {
        var params = {screen_name: 'SaijaiOsika'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
          if (!error) {
            for (var i=0; i<tweets.length; i++) {
              let date = new Date(tweets[i].created_at);
              console.log('Tweeted at: ', date.toLocaleString());
              console.log(tweets[i].text + '\n');
            }
          
          } else {
            console.log('>>>> ERROR', error);
          }
        });
      }

      if (command === "spotify-this-song") {
        spotify.search({ type: 'track', query: input }, function(error, data) {
          if (error) {
            return console.log('>>>> ERROR', error);
          }
          else {

              console.log("Artist: ",data.tracks.items[0].artists[0].name); 
              console.log("Album: ",data.tracks.items[0].album.name);
              console.log("Song's name: ",data.tracks.items[0].name);
              console.log("Preview link: ",data.tracks.items[0].preview_url + '\n');
          
          }
        });
      }
      
      
      if (command === "movie-this") {
        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {

          // If the request is successful
          if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(body));
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where movie was produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
          }
          
        })
      }
      });

 	  } // End do-what-it-says
  }); // End promise


  

