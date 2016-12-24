
module.exports = function(io, data) {
                

    // create connection with io API
    io.on('connection', function(socket) {

        var current_user = '';

        var cookie = socket.handshake.cookies;

        console.log(cookie);

        socket.on('login', function(user) {
            console.log(user);
            data.users.push({
                user: user, 
                color: getRandomColor()
            });


            io.emit('login', data.users);
        })

        socket.on('disconnect', function() {
            socket.handshake.cookies.expires = 'Thu, 18 Dec 2000 12:00:00 UTC';
            console.log('user disconnected');
        });

        socket.on('chat message', function(msg) {
            data.messages.push({
                user: msg.user,
                message: msg.message
            });
            console.log('message: ' + msg);
            io.emit('chat message', data.messages);
        })

    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}