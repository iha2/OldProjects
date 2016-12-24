/*
 *  socket.fact.js
 *  This file handles the injection of the socket.io api
 *  so that the application has global access to the socket.io
 *  methods
*/


function socket(socketFactory) {
    return socketFactory();
};