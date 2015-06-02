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

    .factory('Matches', function($http, $stateParams, $q) {

        return {
            getUpcoming: function() {
                var deferred = $q.defer();
                $http.post(apiUrl +'/'+ $stateParams.tournamentUrl +'/matches/liststatus', {status:'ready', startPos: 0, limit: 10}).success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.reject("An error occurred while fetching items");
                });
                return deferred.promise;
            },
            getCurrent: function() {
                var deferred = $q.defer();
                $http.get(apiUrl +'/'+ $stateParams.tournamentUrl +'/matches/listplaying').success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.reject("An error occurred while fetching items");
                });
                return deferred.promise;
            },
            getFinished: function(page) {
                var deferred = $q.defer();
                var startPos = page * 10;
                $http.post(apiUrl +'/'+ $stateParams.tournamentUrl +'/matches/liststatus', {status:'played', startPos: startPos, limit: 10, sortOrder: 'DESC'}).success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.reject("An error occurred while fetching items");
                });
                return deferred.promise;
            },
            searchPlayer: function(searchText) {
                var deferred = $q.defer();
                $http.post(apiUrl +'/'+ $stateParams.tournamentUrl +'/matches/listsearch', {searchQuery:searchText}).success(function(data){
                    deferred.resolve(data);
                }).error(function(){
                    deferred.reject("An error occurred while fetching items");
                });
                return deferred.promise;
            }
        };
    })

    .factory('Settings', function($http, $stateParams, $q, $ionicPush, $localstorage) {

        return {
            setNotificationsEnabled: function(enabled) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/enabled', {platform:'iOS', deviceToken: deviceToken, enabled: enabled}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            setNotificationsNextMatch: function(period) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/nextmatch', {platform:'iOS', deviceToken: deviceToken, period: period}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            getDeviceToken: function() {
                var deferred = $q.defer();

                if ($localstorage.get('deviceToken') != null) {
                    deferred.resolve($localstorage.get('deviceToken'));
                } else {
                    // Register with the Ionic Push service.  All parameters are optional.
                    $ionicPush.register({
                        canShowAlert: true, //Can pushes show an alert on your screen?
                        canSetBadge: true, //Can pushes update app icon badges?
                        canPlaySound: true, //Can notifications play a sound?
                        canRunActionsOnWake: true, //Can run actions outside the app,
                        onNotification: function(notification) {
                            // Handle new push notifications here
                            // console.log(notification);
                            $scope.lastNotification = JSON.stringify(notification);
                            return true;
                        }
                    }).then(function(deviceToken) {
                        deferred.resolve(deviceToken);
                        $localstorage.set('deviceToken', deviceToken)
                    });
                }

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
