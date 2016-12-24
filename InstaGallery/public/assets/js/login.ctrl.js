
function loginController($http) {

    var vm = this;

    vm.authenticate = function() {
        $http.get('/authenticate');
    }

};