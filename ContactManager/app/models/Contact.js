
var DBInterface = require('../../db/interface/Interface'),
    ContactInterface = DBInterface.ContactInterface();

var Contact = function (email, firstname, lastname) {

    this.email = email;
    this.firstname = fistname;
    this.lastname =  lastname;

    // console.log('there');
    console.log(this);
    return this;
}

Contact.add = function (contact) {
    // console.log("passing contact ");
    // console.log(contact);
    // console.log(ContactInterface);
    return ContactInterface.add(contact.user_id, contact);
}

Contact.get = function (contactList) {
    return ContactInterface.get(contactList);
}

Contact.update = function (contactData) {
    return ContactInterface.update(contactData);
}

Contact.remove = function (contactID) {
    return ContactInterface.remove(contactID);
}

module.exports = Contact;