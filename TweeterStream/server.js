/*
 * Server side for chat server
 */

 var app         = require('express')(),
 http            = require('http').Server(app),
 express         = require('express'),
 cookieParser    = require('cookie-parser'),
 Twitter         = require('twitter-node-client').Twitter


 app.use(express.static('public'));


 var config = {
    "consumerKey": "MEwg1vqhmvzSlEySJSWkxOqIu",
    "consumerSecret": "yaIdUvtr5dmkanM0sOx0mSsDoX1koIG84hS5781gbTHPv8Ahgo",
    "accessToken": "790727594-pz8azT7t7vGoyfdi1ok7f5dFf8BQHJ7uldQ03jcb",
    "accessTokenSecret": "q2Jy5dUVS2WEoHyLGNIvmg6aBQRL5unEyrcZaqyZUsnVj",
    "callBackUrl": "http://localhost:8001"
}

var twitter = new Twitter(config)


// global variables that stores users information
var tweets = [];


app.get('/cleanup/', function(req, res) {
    tweets = []
    res.send("clean");
    console.log(tweets)
})

app.get('/tweets/:tag', function(req, res) {
    var since_id = '';
    if (tweets[tweets.length-1] !== undefined) { 
        try {
            tweets[tweets.length-1] = JSON.parse(tweets[tweets.length-1])
        } catch (err) {
            console.log('Error :' + err);
        }
    } else {
        since_id = ''
    }

    function parseData(info) {
        return info.statuses.map(function(tweet) {
            console.log(tweet.created_at.match(/\d\d:\d\d:\d\d/)[0])
            return {
                id: tweet.id,
                text: tweet.text,
                created_at: tweet.created_at.match(/\d\d:\d\d:\d\d/)[0]
            }
        })
    }

    console.log('since id: ' + since_id)
    console.log(req.params.tag)
    twitter.getCustomApiCall('/search/tweets.json'
        , {q: req.params.tag, since_id: since_id, count: 5}, 
        function (err, response, body) {
            console.log('Error: ' + err)
            res.send(err)
        }, function(data) {
            if (tweets.length !== 0) {
                var info = JSON.parse(data)
                var parsed_data = parseData(info)

                var all_tweets = {}
                var new_tweets = []

                function addToUniqueSet(tweet) {
                    if (all_tweets[tweet.id] !== undefined) {
                        all_tweets[tweet.id].push(tweet);
                    } else {
                        all_tweets[tweet.id] = []
                        all_tweets[tweet.id].push(tweet);
                    }
                }

                function notAnB(tweets, parsed_data) {
                    parsed_data.map(function(tweet) {
                        addToUniqueSet(tweet)

                    })
                    tweets.map(function(tweet) {
                        addToUniqueSet(tweet)
                    })

                    var ids = Object.keys(all_tweets)

                    new_tweets = ids.map(function(key) {
                        if (all_tweets[key].length === 1) {
                            tweet_list = all_tweets[key]
                            return tweet_list[0]
                        }
                    })

                    new_tweets = new_tweets.filter(function(tweet) {
                        return tweet !== undefined
                    })
                    
                }

                notAnB(tweets, parsed_data)
                console.log('filtered tweets')

                tweets = tweets.concat(new_tweets)
                console.log('\n new tweets')
                console.log(new_tweets)
                res.send(new_tweets)

            } else {
                var info = JSON.parse(data)
                console.log("\n\n")
                var parsed_data = parseData(info)
                tweets = tweets.concat(parsed_data)
                console.log(tweets)
                res.send(tweets)
            }
        })
})

var PORT = 8002

// render page on port
http.listen(PORT, function() {
    console.log('listening on port: ' + PORT);
});
// import all the working app modules
require('./app/routes')(app);