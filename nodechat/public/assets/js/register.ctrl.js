/*
 *   register.ctrl.js
 *   This controller handles initial registration for the user processing
 *   browerser data for remembering the user when the page in refreshed
 *   or returned to.
 *
*/

function registerCtrl($cookies, $http, $rootScope, userdata, socket) {

    var vm = this;

    vm.users      = [];
    vm.userdata   = userdata;
    $rootScope.user = '';

    Date.prototype.addHours = function(h){
        this.setHours(this.getHours()+h);
        return this;
    }


    vm.submit = function() {
        event.preventDefault();

        $rootScope.user = vm.user;
        socket.emit('login', vm.user);
        $cookies.put('user', vm.user);
        $cookies.put('expires', 
            new Date().addHours(3));
        angular.element('#name').val('');
        angular.element("#register, #chatters").toggle();
        angular.element("#m").prop('disabled', false);
    }


    socket.on('connect', function() {


       // checks if the user has already logged in
       (function () {

            if ($cookies.get('user') !== undefined ) {

                angular.element("#register, #chatters").toggle();
                angular.element("#m").prop('disabled', false);

                $http.get('/users').then( 
                    function(fulfillment) {
                        userdata.copy(fulfillment.data);
                    }, function(){
                        console.log("user data not available");
                    });

                $http.get('/messages').then(
                    function(fulfillment) {
                        $rootScope.messages = userdata.getWithColor(fulfillment.data);
                    })

            };
        })();

        socket.on('login', function(users) {
            vm.userdata.copy(users);

            // get messages from server
            $http.get('/messages').
            success(function(data, status, headers, config) {
                $rootScope.messages = userdata.getWithColor(data);
            }).
            error(function(data, status, headers, config) {
                console.log("message could not be gotten from the server");
            });

        });
    });
    
};


