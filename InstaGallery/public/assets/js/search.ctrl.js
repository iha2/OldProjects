/*
 *  name:       search.ctrl.js 
 *  function:   search.ctrl.js request instagram json data from the server
 *              to be displayed in the application.
 *              
 */


/* searchController:- handles all dynamic activity in the application
                          results from promises are reffered to as 
                          fullfillments*/


function searchController($scope, getTagData) {

    var vm = this;

    vm.input = '';

    vm.tags = {
        meta: '',
        data: [
        {"media_count":4577663,"name":""}
        ]
    };

    vm.image_urls= {};


    //search:- searches tags that match string disaplys dynamically in view
    vm.search = function(value) {

        var server_data = getTagData.data('/hashtag/:' + value);

        server_data.then(
            function(fulfillment){
                vm.tags = fulfillment.data;
            }, function(){
                console.log("Server did not send tag data.");
            });
    };

    // getImagesInfo:- gets all data on images and stores it's urls
    vm.getImagesInfo = function(value) {

     var server_data = getTagData.data('/images/:' + value);

     server_data.then(
        function(fulfillment) {
            var info = fulfillment.data.data;
            var all_image_urls = info.map(function(obj) {
                if (obj.type === "image") {
                    return obj.images.standard_resolution.url;
                }
            });

                // removed undefined values from list of images
                vm.image_urls = all_image_urls.filter(function(obj){
                    return obj !== undefined;
                }).slice(0,10);
                
            }, function() {
                console.log('Server did not send image data');
            });
    };


     $scope.$watch(function(){
        return vm.input;
    }, function(newVal){
        if (newVal === "") { 
            angular.element("#tag_results ul").hide();      
        } else {
            angular.element("#tag_results ul").show(); 
            vm.search(newVal);
        }
    });

     $scope.$watch(function(){
        return vm.tags;
    }, function(newVal){
        vm.tags = newVal;
    });

     $scope.$watch(function(){
       return vm.image_urls;
        }, function(newVal){
        vm.image_urls = newVal;
    });
 };
