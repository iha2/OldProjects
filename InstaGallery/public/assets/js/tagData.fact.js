
    //  stores a generic http promise
    function getTagData($http) {
        var data = function (value) {
            return $http.get(value);
        }
        return { data: data }
    };