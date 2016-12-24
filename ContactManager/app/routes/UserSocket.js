
var UserSocket = function(socket, room_id) {

    socket.on("user_"+room_id, function (data) {
        // console.log("connected to user with special room " +room_id );
                // console.log(data);
    });
}

module.exports = UserSocket;
// socket.on

