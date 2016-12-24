/*
 *   message.ctrl.js
 *   This controller handles the submission of message to be displayed
 *   by the user to other users and to the principal user as well.
 *   It takes advantage of the socket.io API to handle the sending and reciving
 *   of test to and from the user.
*/


function messageCtrl($rootScope, socket, userdata) {
    var vm  = this;

    vm.userdata = userdata;

    vm.submit = function() {
        event.preventDefault(); // prevent reloading of page
        socket.emit('chat message', {
            user: $rootScope.user,
            message: angular.element('#m').val()
        });
        angular.element('#m').val('');
    }

    socket.on('chat message', function(messages) {
        if (messages.length !== 0) {
            $rootScope.messages = vm.userdata.getWithColor(messages);
        };
    });   
};