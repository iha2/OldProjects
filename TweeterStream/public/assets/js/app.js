
var app = angular.module('tweetStream', [])
.controller('tweetController', tweetController)

function tweetController($http, $scope, $interval) {
    var vm = this
    vm.tag = ""

    vm.tweets = []
    vm.tweeter;
    var runs = 0
    var getTweets = function() {
        $http.get('/tweets/' + vm.tag).then(function(tweet) {
            if (tweet.data !== "no new tweets") {
                var unsorted = vm.tweets.concat(tweet.data)
                console.log(unsorted)
                vm.tweets = unsorted.sort(function(a, b) {
                    return new Date('1970/01/01 ' + a.created_at) - new Date('1970/01/01 ' + b.created_at);
                }).reverse()
                console.log(vm.tweets)

            } else if (tweet.data.data.errors) {
                console.log(tweet.data.data.errors.message)
            }
        })
    }

    vm.tweetGetter = function() {
        vm.tweets = [];
        if (vm.tweeter) {
            $interval.cancel(vm.tweeter)
            $http.get('/cleanup').then(function(ans) {
                return console.log(ans)
            })
        }
        vm.tweeter = $interval(getTweets, 5000);
    }

    $("#tag").keyup(function(event){
        if(event.keyCode == 13){
            vm.tweetGetter();
        }
    });
}
