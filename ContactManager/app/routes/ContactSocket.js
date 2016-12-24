
var Contact = require('../../app/models/Model').Contact;

var ContactSocket = function(socket, room_id) {

    socket.on("add_contact_"+room_id, function (data) {
        console.log("connected to user with special contact room " +room_id);

        //console.log(Contact);
        Contact.add(data).then(function (result) {
            // console.log(result);

            socket.emit('add_contact_'+data.user_id, {
                success: true,
                contact: data
            });
        });
    });

    socket.on("edit_contact_"+room_id, function (updatedContact) {
        console.log("saved contact");
        console.log(updatedContact);

        return Contact.update(updatedContact).then(function (contact) {
            console.log("returned save");
            console.log(contact);

            socket.emit("edit_contact_"+room_id, contact);
        })
        .catch(function (reason) {
            console.log('broke');
            console.log(reason);
        });
    });

    socket.on("remove_contact_"+room_id, function (removedContact) {

        Contact.remove(removedContact.id);
        if (!removedContact) throw removedContact;

        socket.emit("remove_contact_"+romm_id, {success: true});
    });
}

module.exports = ContactSocket;
// socket.on

