angular.module('tournia.services', [])

.factory('Rankings', function($http, $stateParams, $q) {

    return {
        apiPath:'/api/shoppingCart/',

        getDisciplines: function() {
            //Creating a deferred object
            var deferred = $q.defer();

            //Calling Web API to fetch shopping cart items
            $http.get(apiUrl +'/'+ $stateParams.tournamentUrl +'/disciplines').success(function(data){
                //Passing data to deferred's resolve function on successful completion
                deferred.resolve(data);
            }).error(function(){
                //Sending a friendly error message in case of failure
                deferred.reject("An error occurred while fetching items");
            });

            //Returning the promise object
            return deferred.promise;
        },
        get: function(disciplineId) {
            var deferred = $q.defer();
            $http.get(apiUrl +'/'+ $stateParams.tournamentUrl +'/ranking/discipline/'+ disciplineId).success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    };
})

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);
