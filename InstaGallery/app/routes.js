/*
 *  name:       routes.js 
 *  function:   handles get and post calls for the application.
 *              routes.js also pull data from the instagram api for the
 *              get and pull reqest using the request library       
*/

module.exports = function (app, request) {

    var request = require('request'),
    qs          = require('querystring');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // Instagram token
    var token   = '8619424.1fb234f.7269466246614d66b271705b4ec43707'

    var InstaGallery = {
        clientID        : '1b99b253d51145d2bb68f5ae1b2a88a1',
        client_secret   : '712ccaf702214bb58aca9a3ab6caffc2',
        websiteURL      : 'http://localhost:3000/',
        redirectURI     : 'http://localhost:3000/redirect'

    }

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/views/index.html');
    });

    app.get('/authenticate', function(req, res){

        var link = 'https://api.instagram.com/oauth/authorize/?client_id='
                    + InstaGallery.clientID 
                    + '&redirect_uri='
                    + InstaGallery.redirectURI
                    +'&response_type=code';

        res.redirect('http://www.google.com');
    });

    app.get('/redirect', function(req, res) {
        console.log(req.url);    
    });

    // returns list of similar hashtag requested
    app.get('/hashtag/:hashtag', function(req, res) {
        var link  = 'https://api.instagram.com/v1/tags/search?q='
                    + req.params.hashtag.substr(1) 
                    + '&access_token=' 
                    + token;


        request(link, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
                console.log("Instagram is not responding");
            }
        });
    });

    // returns image data that matches the hashtag requested
    app.get('/images/:hashtag', function(req, res) {
        var link = 'https://api.instagram.com/v1/tags/'+ 
            req.params.hashtag.substr(1) 
            + '/media/recent?access_token=' 
            + token;

        request(link, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
                console.log("Instagram is not responding");
            }  
        });

    });


}