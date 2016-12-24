
var UserSocket = require("./UserSocket");
var ContactSocket = require("./ContactSocket")

var initializeSockets = function (io, room_id) {
        // console.log("initialzed " + room_id);

        io.on("connection", function(socket) {
          UserSocket(socket, room_id);
          ContactSocket(socket, room_id);
        });
}

module.exports = initializeSockets;