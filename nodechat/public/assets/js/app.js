/*
 *   main.js
 *   main.js contains the initial commands that must run within
 *   the application as well as the initial definitions for
 *   the angular application  
*/


var app = angular.module('chatapp', ['btford.socket-io', 'ngCookies'])
            .factory('socket', socket)
            .factory('userdata', userdata)
            .controller('registerCtrl', registerCtrl)
            .controller('messageCtrl', messageCtrl);

(function() {
    'use strict';

    angular.element('#chatters').hide();
    angular.element('#m').prop('disabled', true);

})();