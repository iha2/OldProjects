/*
 *  userdata.fact.js
 *  This files stores all the other users in presently using the applicaiton
 *  and processing the properties of each user such the users display color.
 *  It also stores methods that handle processing of user data relative to 
  *  message data
*/


function userdata(){
    var user_names = [];

    function userList() {
        return user_names.map(function(obj){
            return obj.user;
        });
    }

    /* getWithColor
     * This function creates an array of message object with the color
     * designated to the user upon registration
    */

    function getWithColor(messages) {
        return messages.map(function(obj){
            var user_list = userList();
            var index = -1;
            for (var j = 0; j < user_list.length; j++) {
                if (user_list[j] === obj.user) {
                    index = j;
                    break;
                };
            }  

            if (index > -1 ) {
                return {
                    user: obj.user,
                    message: obj.message,
                    color: user_names[index].color
                }
            }
        });
    }

    return {
        get:        function() { return user_names },
        copy:       function(users) {
            user_names = users;
        },
        userList:   function() {return userList()},
        getWithColor: function(messages) {return getWithColor(messages)}
    }
};

