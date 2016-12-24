(function(window) {
    var jQuery;
    var domain = "http://localhost:3000/";

    var ContactsDB = function (contacts) {
        var db = {};

        var orderedSets = {
            byFirstName: {},
            byLastName: {},
            byPhone: {},
            byEmail: {}
        };

        var insert = function (contact) {
            if (!orderedSets.byFirstName[contact.firstname]) {
                console.log(orderedSets.byFirstName[contact.firstname]);
                orderedSets.byFirstName[contact.firstname] = [orderedSets.byFirstName[contact._id]];
            } else {
                console.log(orderedSets.byFirstName);
                console.log(orderedSets.byFirstName[contact.firstname]);
                orderedSets.byFirstName[contact.firstname].push(contact._id);
            }

            if (!orderedSets.byLastName[contact.lastname]) {
                orderedSets.byLastName[contact.lastname] = [orderedSets.byLastName[contact._id]];
            } else {
                orderedSets.byLastName[contact.lastname].push(contact._id);
            }

            if (!orderedSets.byPhone[contact.phone]) {
                orderedSets.byPhone[contact.phone] = [orderedSets.byPhone[contact._id]];
            } else {
                orderedSets.byPhone[contact.phone].push(contact._id);
            }

            if (!orderedSets.byEmail[contact.email]) {
                orderedSets.byEmail[contact.email] = [orderedSets.byEmail[contact._id]];
            } else {
                orderedSets.byEmail[contact.email].push(contact._id);
            }
        }

        contacts.map(function (contact) {
            db[contact._id] = contact;
            insert(contact);
        });
        // console.log(orderedSets);

        var checkMatchingKeys = function (dataObject, data) {
            return Object.Keys(dataObject).filter(function (key) {
                return key.ToString().includes(data);
            });
        }

        var findIDsInOrderedSets = function (data) {
            if (orderedSets.byFirstName[data]) {
                return checkMatchingKeys(orderedSets.byFirstName, data);
            } else if (orderedSets.byLastName[data]) {
                return checkMatchingKeys(orderedSets.byLastName, data);
            } else if (orderedSets.byPhone[data]) {
                return checkMatchingKeys(orderedSets.byPhone, data);
            } else if (orderedSets.byEmail[data]) {
                return checkMatchingKeys(orderedSets.byEmail, data);
            }
        }

        var drop = function () {
            db = {};
        }

        var find = function (data) {

            var ids = findIDsInOrderedSets(data);
            var foundContacts;

            if (ids) {
                foundContacts = ids.map(function (id) {
                    return contacts[id];
                });
            }
            return foundContacts;
        };


        var importData = function (contacts) {
            contacts.map(function (contact) {
                insert(contact);
            });
        }

        return {
            find: find,
            insert: insert,
            import: importData
        }
    };

    var contactsDB;
    var contacts;

    var userData =  {
        user: {},
        file: "",
        contacts: [{}],
        indexedContacts: {}
    }
    var socketData;
    var userTemplate;
    var contactTemplate;

    var CM = {
        scriptLoadHandler: function () {
            // Restore $ and window.jQuery to their previous values and store the
            // new jQuery in our local jQuery variable
            jQuery = window.jQuery.noConflict(true);
            // Call our main function
            CM.main();
        },

        user : {
            init : function (user) {
                // console.log("socket hit");
                var socket = io(domain);
                contactsDB = new ContactsDB(user.contacts);
                socket.emit("user_"+user._id, 'Sent an event from the client!');
                jQuery(".cntct-add-contact").click(CM.user.toggleContactVisibilty);
                var socketDataSet = {
                    socket: socket,
                    id : user._id
                };
                socketData = socketDataSet;
                CM.user.initUserEvents();
            },

            loadDOM : function () {
                userTemplate = userData.file;
                var template = Handlebars.compile(userTemplate);
                var html = template({user: userData.user});
                jQuery("#ContactManager").empty();
                jQuery("#ContactManager").html(html);

                contacts = userData.user.contacts;
                // console.log("got in here");
                // console.log(userData.contacts);
                contactTemplate = userData.contacts;
                template = Handlebars.compile(contactTemplate);
                // console.log(contacts);
                html = template({contacts: contacts});
                jQuery(".contacts-container").html(html);

            },
            // redraw dom functions
            reloadDOM : function (searchSubstring) {

                userData.searchSubstring = searchSubstring;
                var template = Handlebars.compile(userTemplate);
                var html = template({user: userData.user});
                contactTemplate = userData.contacts;
                userData.searchSubstring = searchSubstring;
                template = Handlebars.compile(contactTemplate);
                contacts = userData.user.contacts;
                html = template({contacts: contacts});
                jQuery(".contacts-container").html();
                console.log("another reload");
                CM.user.initUserEvents();
            },

            // UI behaviours
            loadAndDisplayUser : function(err, loginData) {
                if (loginData.validation) {
                    userData.user = loginData.user;
                    userData.file = loginData.file;
                    userData.contacts = loginData.contacts;
                    loginData.user.contacts.map(function (element) {
                        // console.log(element);
                        userData.indexedContacts[element._id] = element;
                        // console.log(userData.indexedContacts[element._id]);
                    });
                    CM.user.loadDOM();
                    CM.user.init(loginData.user);
                } else {
                    console.log("Somehow the data we just entered is invalid");
                }
            },
            toggleContactVisibilty : function() {
                if (jQuery("#AddContact").is(":visible")) {
                    jQuery("#AddContact").hide();
                    jQuery("#Contacts").show();    
                } else {
                    jQuery("#AddContact").show();
                    jQuery("#Contacts").hide();
                }
            },
            collectContactData: function (clickContext) {

                // console.log("getting edit information");
                // console.log(clickContext);
                var contactList = jQuery(jQuery(clickContext)[0]).parent().prev()[0];
                // console.log(jQuery(contactList));
                var id = jQuery(contactList).find("._id")[0];
                var firstname = jQuery(contactList).find('.firstname')[0];
                var lastname = jQuery(contactList).find('.lastname')[0];
                var phone = jQuery(contactList).find('.phone')[0];
                var email = jQuery(contactList).find('email')[0];
                var address = jQuery(contactList).find('address')[0];

                var editedContact = {};
                editedContact.id = jQuery(id).val();
               // console.log(id);
               // console.log(editedContact);
               if (firstname) { 
                editedContact.firstname = jQuery(firstname).val();
                // console.log(jQuery(jQuery(jQuery(contactList).parent().find('h4')[0]).find('span')[0]));
                jQuery(jQuery(jQuery(contactList).parent().find('h4')[0]).find('span')[0]).html(editedContact.firstname);
            }
            // console.log(lastname);
            if (lastname) { 
                editedContact.lastname = jQuery(lastname).val();
                // console.log(jQuery(jQuery(jQuery(contactList).parent().find('h4')[0]).find('span')[1]));
                jQuery(jQuery(jQuery(contactList).parent().find('h4')[0]).find('span')[1]).html(editedContact.lastname);
            }
            if (phone) { editedContact.phone = jQuery(phone).val() }
             if (email) { editedCsontact.email = jQuery(email).val() }
                 if (address) { editedContact.address = jQuery(address).val() }

               // clean up keys that have no values in their container
                // console.log(editedContact);
                Object.keys(editedContact).map(function (key) {
                    if (!editedContact[key]) {
                        delete editedContact[key];
                    }
                    else {
                        userData.indexedContacts[editedContact.id][key] = editedContact[key];
                    }
                });

                // console.log(userData.indexedContacts);
                jQuery(clickContext).parent().parent().slideUp('slow');
                socketData.socket.emit('edit_contact_'+socketData.id, editedContact);

            },

            editContacts: function (socketData) {
                var confirmEdit = jQuery('.submit-edit');
                
                confirmEdit.click(function () {
                    // console.log('edited clicked');
                    CM.user.collectContactData(jQuery(this));
                });

            },
            removeContact: function (clickContext) {
                // console.log(clickContext);
                var contactData = jQuery(clickContext[0]).parent().prev().prev();
                // console.log(contactData[0]);
                // console.log(jQuery(contactData[0]).find('._id'));
                var deleteID = jQuery(contactData[0]).find('._id').val();
                // console.log(deleteID);
                socketData.socket.emit("remove_contact_"+userData.user.id, contactData);
                userData.user.contacts = userData.user.contacts.filter(function (contact) {
                    if (contact._id !== deleteID) {
                        // console.log(contact._id);
                        // console.log(contact);
                        return contact;
                    };
                });
                // console.log(userData.user.contacts);
                delete userData.indexedContacts[deleteID];
                // console.log(userData.user.contacts);
                console.log("reload in here");
                CM.user.reloadDOM();
            },
            ContactDisplayEvents : function () {

                // hide or show inputs
                jQuery('.cntct-data label').click(function() {
                    jQuery(this).hide();
                    jQuery(this).next().show();
                });

                jQuery('.cntct-data input').focusout(function () {
                    jQuery(this).parent().hide();
                    jQuery(this).parent().prev().html(jQuery(this).val());
                    jQuery(this).parent().prev().show();

                });

                jQuery('.display').click(function () {
                    if (jQuery(this).next().is(':visible')) {
                        jQuery(this).next().slideUp('slow');
                    } else {
                        jQuery(this).next().slideDown('slow');
                    }
                });

                jQuery('.open-remove-option').click(function() {
                    var confirmer = jQuery(jQuery(this).parent().next());
                    // console.log(confirmer);
                    if (confirmer.is(':visible')) {
                        confirmer.slideUp('slow');
                    } else {
                        confirmer.slideDown('slow');
                    }
                });

                jQuery('.ignore-erase').click(function () {
                    var confirmer = jQuery(this).parent();
                    // jQuery(this).slideUp();
                    confirmer.slideUp();
                });

                jQuery('.submit-erase').click(function () {
                    CM.user.removeContact(jQuery(this));
                });
                CM.user.editContacts();
            },

            searchBarEvents: function (searchInput) {
                return function () {
                    // console.log(jQuery('.search input[name=search]').val());
                    var searchCriteria  = jQuery('.search input').val();
                    var similarContacts = contactsDB.find(searchCriteria);
                    console.log("reload in here");
                    CM.user.reloadDOM(searchInput);
                    jQuery('.search input[name=search]').focus();
                    // jQuery('.search input[name=search]').value(searchInput);
                }
            },
            initConnectionEvents : function () {
                socketData.socket.on("add_contact_"+socketData.id, function(data) {
                    // console.log("got data back");
                    // console.log(data);
                    if (data.success) {
                        userData.user.contacts.push(data.contact);
                        userData.user.indexedContacts[data.contact._id];
                    }
                });

                socketData.socket.on("edit_contact_"+socketData.id, function(data) {
                    // console.log("was saved");
                    // userData.contacts[data._id] = data;
                    // console.log(data);

                    userTemplate = userData.file;
                    var template = Handlebars.compile(userTemplate);
                    // console.log(userData.user.contacts);
                    console.log("reload in here");
                    CM.user.reloadDOM();
                });

                socketData.socket.on("remove_contact_"+socketData.id, function (data) {
                    if (data.success) {
                        conole.log("reload is here");
                        CM.user.reloadDOM();
                    }
                });
            },

            initUserEvents : function () {
                // console.log(CM.user.addContact(socketData));
                jQuery("#AddContact .submit").click(CM.user.addContact(socketData));
                jQuery('.search input[name=search]')
                .keypress(CM.user.searchBarEvents(jQuery('.search input[name=search]').val()));
                
                CM.user.ContactDisplayEvents();
                CM.user.initConnectionEvents();
            },

            validateContactData : function () {
                return true;
            },

            grabContactData : function () {
                if (CM.user.validateContactData())
                    var newContact = {
                        firstname: jQuery("#AddContact .firstname").val(),
                        lastname: jQuery("#AddContact .lastname").val(),
                        phone: jQuery("#AddContact .phonenumber").val(),
                        email: jQuery("#AddContact .email").val(),
                        job : jQuery("#AddContact .job-title").val(),
                        company : jQuery("#AddContact .company").val(),
                        address: jQuery("#AddContact .address").val(),
                        friend: jQuery('#AddContact .cntct-friend').val(),
                        family: jQuery("#AddContact .cntct-family").val(),
                        colleague: jQuery("#AddContact .cntct-colleague").val()
                    };
                    return newContact;
                },
                addContact : function(socketData) {
                // a little bit of currying here
                return function () {
                    // console.log("ran nested add contact function");
                    var contact = CM.user.grabContactData();
                    contact.user_id = socketData.id;
                    socketData.socket.emit('add_contact_'+socketData.id, contact);

                    CM.user.toggleContactVisibilty();
                }
            }
        },

        // logging the user into the server siide application. Helper functions included
        login : {
            loginValidation : function (payload, callback) {
                jQuery.ajax({
                    method: "POST",
                    url: domain + "login/auth",
                    data: payload
                })
                .done(function(data) {
                    if (data.validation) {
                        if (typeof callback == "function")
                            return callback(null, data);
                    } else {
                        jQuery("#ContactLogin .error").map(function(element) {
                            jQuery(this).empty();
                        });
                        // console.log(data);
                        if (data.errorType == "user") {
                            jQuery("#ContactLogin .user-error").html(data.data);
                        } else if (data.errorType == "pass") {
                            // console.log(data.data);
                            jQuery("#ContactLogin .pass-error").html(data.data);
                        }
                        return callback(null, data);
                    }
                });
            },
            loginSubmit: function () {
                var payload = {
                    username : jQuery(".username").val(),
                    password : jQuery(".password").val()
                };
                // console.log("submited");
                CM.login.loginValidation(payload, CM.user.loadAndDisplayUser);
            }
        },

        // helper functions for allowing users to register their information.
        signUp : {
            init : function() {
                jQuery("#ContactLogin").hide();
                jQuery("#ContactSignUp").show();
                jQuery("#sign-up-submit").click(CM.signUp.signUpSubmit);
                jQuery("#sign-up-login").click(CM.signUp.signUpLogin);
            },
            matchPassword : function (password1, password2) {
                if (password1 === password2) {
                    if (password1 == false && password2 == false) {
                        jQuery(".sign-up-error").html("Please enter a password");
                        return false;  
                    }
                    // console.log("proper inputs");
                    return true;
                } else {
                    jQuery(".sign-up-error").html("Your passwords do not match");
                    return false;
                }
            }, 
            signUpSubmit : function () {
                // console.log("clicked");
                jQuery.ajax({
                    method : "POST",
                    url: domain + "signup/validate",
                    data: { username: jQuery("#ContactSignUp .username").val() }
                })
                .done(function (data) {

                    if (data.validation && data.errorType === undefined) {
                        var comparePasswordResult = CM.signUp.matchPassword(jQuery("#ContactSignUp .password").val(), jQuery("#ContactSignUp .password2").val());

                        // console.log(comparePasswordResult);
                        if (comparePasswordResult) {
                            //console.log("Register user");
                            var payload = {
                                username : jQuery("#ContactSignUp .username").val(),
                                password: jQuery("#ContactSignUp .password").val(),
                                firstname : jQuery("#ContactSignUp .firstname").val(),
                                lastname : jQuery("#ContactSignUp .lastname").val(),
                                phonenumber: jQuery("#ContactSignUp .phonenumber").val()
                            };

                            // console.log(payload);
                            jQuery(".error").map(function() {
                                jQuery(this).empty();
                            });  
                            CM.signUp.registerUser(payload);
                        }
                    } else {
                        jQuery("#ContactSignUp .signup-user-error").html("User already exists");
                    }
                });
            },
            signUpLogin : function () {
                jQuery("#ContactSignUp").hide();
                jQuery("#ContactLogin").show();
                jQuery("ContactLogin").show();
            },
            registerUser : function (payload) {
                // console.log("sending user data..");
                jQuery.ajax({
                    method: "POST",
                    url: domain + "signup/register",
                    data: payload
                })
                .done(function (data) {
                   if (data.validation) {
                    CM.login.loginValidation({ username: payload.username, password: payload.password }, CM.user.loadAndDisplayUser);
                } 
            });
            }
        },


        main: function () { 

            jQuery(document).ready(function($) { 

                $.ajax({url: domain + "login"}).done(function (data) {
                    // console.log("got data");
                    $('#ContactManager').html(data);
                    $("#ContactSignUp").hide();                    
                    $("#ContactLogin #submit").click(CM.login.loginSubmit);
                    $("#ContactLogin #sign-up").click(CM.signUp.init);
                });
            });
        }
    }


    /******** Load jQuery if not present *******
    ** Code for JQuery loading and initialization gotten from
    ** http://alexmarandon.com/articles/web_widget_jquery
    **/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("src",
            "https://code.jquery.com/jquery-3.1.0.min.js");

        if (script_tag.readyState) {
          script_tag.onreadystatechange = function () { // For old versions of IE
              if (this.readyState == 'complete' || this.readyState == 'loaded') {
                  scriptLoadHandler();
              }
          };
        } else { // Other browsers
          script_tag.onload = CM.scriptLoadHandler;
      }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        CM.main();

        jQuery('.display').click(function () {
            // console.log("ok");
            if (jQuery(this).next().is(':visible')) {
                jQuery(this).next().slideUp('slow');
            } else {
                jQuery(this).next().slideDown('slow');
            }
        });
    }
    
})(window);