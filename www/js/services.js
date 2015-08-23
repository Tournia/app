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

.factory('Tournaments', function($http, $stateParams, $q) {

    var currentTournament = null;

    return {
        getTournament: function(tournamentUrl) {
            var deferred = $q.defer();
            $http.get(apiUrl +'/'+ tournamentUrl +'/tournament').success(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getCurrentTournament: function () {
            if (currentTournament == null) {
                currentTournament = this.getTournament($stateParams.tournamentUrl);
            }
            return currentTournament;
        },
        setCurrentTournament: function(value) {
            currentTournament = value;
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
            },
            checkScore: function(tournament, scoreTeam1, scoreTeam2) {
                correctScore = true;

                if (correctScore && (isNaN(scoreTeam1) || isNaN(scoreTeam2))) {
                    correctScore = false;
                }

                if (tournament.checkScoreMin != null) {
                    if (correctScore && (scoreTeam1 < tournament.checkScoreMin || scoreTeam2 < tournament.checkScoreMin)) {
                        correctScore = false;
                    }
                }

                if (tournament.checkScoreMax != null) {
                    if (correctScore && (scoreTeam1 > tournament.checkScoreMax || scoreTeam2 > tournament.checkScoreMax)) {
                        correctScore = false;
                    }
                }

                return correctScore;
            },
            sendScore: function(tournament, match, score) {
                var scorePost = new Array();
                for (setNr in score) {
                    if (score[setNr].team1 != null || score[setNr].team2 != null) {
                        scoreSet = new Array(score[setNr].team1, score[setNr].team2);
                        scorePost.push(scoreSet);
                    }
                }

                var postData = {
                    matchId: match.matchId,
                    score: scorePost,
                }

                var deferred = $q.defer();
                $.ajax({
                    type: 'POST',
                    cache: false,
                    data: postData,
                    url: apiUrl +'/'+ tournament.url +'/matches/score',
                    dataType: 'json',
                    success: function(data1) {
                        $http.post(apiUrl +'/'+ $stateParams.tournamentUrl +'/matches/finish', {matchId:match.matchId}).success(function(data2){
                            deferred.resolve(data1);
                        });

                    },
                });
                return deferred.promise;
            },
            sendSecondCall: function(tournament, match) {
                var playerIds = new Array();
                for (playerId in match.team1) {
                    if (match.team1[playerId].secondCall) {
                        playerIds.push(playerId);
                    }
                }
                for (playerId in match.team2) {
                    if (match.team2[playerId].secondCall) {
                        playerIds.push(playerId);
                    }
                }

                var postData = {
                    matchId: match.matchId,
                    playerIds: playerIds,
                }

                var deferred = $q.defer();
                $.ajax({
                    type: 'POST',
                    cache: false,
                    data: postData,
                    url: apiUrl +'/'+ tournament.url +'/matches/secondcall',
                    dataType: 'json',
                    success: function(data1) {
                        deferred.resolve(data1);
                    },
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
                    $http.post(apiUrl +'/notifications/'+ deviceToken +'/enabled', {enabled: enabled}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            setNotificationsUpcomingMatch: function(period) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/'+ deviceToken +'/upcomingmatch', {period: period}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            setNotificationsScoreMatch: function(enabled) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/'+ deviceToken +'/scorematch', {enabled: enabled}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            setNotificationsNewMatch: function(enabled) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/'+ deviceToken +'/newmatch', {enabled: enabled}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            setNotificationsStartMatch: function(enabled) {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.post(apiUrl +'/notifications/'+ deviceToken +'/startmatch', {enabled: enabled}).success(function(data){
                        deferred.resolve(data);
                    }).error(function(){
                        deferred.reject("An error occurred while fetching items");
                    });
                });
                return deferred.promise;
            },

            getNotifications: function() {
                var deferred = $q.defer();
                this.getDeviceToken().then(function(deviceToken){
                    $http.get(apiUrl +'/notifications/'+ deviceToken).success(function(data, status){
                        console.log("get notifications = "+ status);
                        deferred.resolve(data);
                    }).error(function(){
                        $http.post(apiUrl +'/notifications/'+ deviceToken, {platform: 'iOS'}).success(function(data){
                            deferred.resolve(data);
                        }).error(function(){
                            deferred.reject("An error occurred while fetching items");
                        });
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
                        $localstorage.set('deviceToken', deviceToken);
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
