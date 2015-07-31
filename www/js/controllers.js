angular.module('tournia.controllers', [])


.controller('MatchesCtrl', function($scope, Matches, $ionicModal, $http, $stateParams, Tournaments, Matches) {
    $scope.doRefresh = function() {
        self.updateView();
    };

    Tournaments.getCurrentTournament().then(function(tournament){
        $scope.isLiveScoreAllowed = tournament.isLiveScoreAllowed;
        $scope.isLive2ndCallAllowed = tournament.isLive2ndCallAllowed;
        $scope.currentTournament = tournament;
    });

    self.updateView = function() {
        $scope.isLoading = true;
        if ($scope.view == "upcoming") {
            Matches.getUpcoming().then(function(data){
                $scope.upcomingMatches = data;
                $scope.isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        } else if ($scope.view == "current") {
            Matches.getCurrent().then(function(data){
                $scope.currentMatches = data;
                $scope.isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        } else if ($scope.view == "finished") {
            Matches.getFinished($scope.page).then(function(data){
                if ($scope.page > 0) {
                    $scope.finishedMatches = angular.extend($scope.finishedMatches, data);

                } else {
                    $scope.finishedMatches = data;
                }
                $scope.isLoading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }

    $scope.setView = function(view) {
        $scope.view = view;
        $scope.page = 0;
        self.updateView();
    }

    // initial load
    $scope.view = 'current';
    $scope.setView($scope.view);

    $scope.loadMoreFinishedMatches = function() {
        $scope.page += 1;
        self.updateView();
    }


    // Match scoring modal //
    $ionicModal.fromTemplateUrl('score-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.scoreModal = modal;
    });
    $scope.openScoreModal = function(match) {
        // define sets
        $scope.scoreModalSets = {};
        for(setNr = 1; setNr <= $scope.currentTournament.nrSets ; setNr++) {
            $scope.scoreModalSets[setNr] = {team1: null, team2: null};
        }

        $scope.scoreModal.show();
        $scope.modalMatch = match;
    };
    // Second call modal //
    $ionicModal.fromTemplateUrl('secondCall-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.secondCallModal = modal;
    });
    $scope.openSecondCallModal = function(match) {
        // define secondCall in players
        match.team1 = {};
        for (playerId in match.team1Players) {
            match.team1[playerId] = {
                playerId: playerId,
                name: match.team1Players[playerId],
                secondCall: false,
            }
        }
        match.team2 = {};
        for (playerId in match.team2Players) {
            match.team2[playerId] = {
                playerId: playerId,
                name: match.team2Players[playerId],
                secondCall: false,
            }
        }

        $scope.secondCallModal.show();
        $scope.modalMatch = match;
    };
    // Other modal functions //
    $scope.closeModal = function() {
        $scope.scoreModal.hide();
        $scope.secondCallModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.scoreModal.remove();
        $scope.secondCallModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });

    $scope.sendScoreModal = function(match) {
        for(setNr in $scope.scoreModalSets) {
            if (!Matches.checkScore($scope.currentTournament, $scope.scoreModalSets[setNr].team1, $scope.scoreModalSets[setNr].team2)) {
                confirmMsg = 'Set %setNr% is an incorrect score, do you want to continue saving it?';
                if (!confirm(confirmMsg.replace('%setNr%', setNr))) {
                    return;
                }
            }
        }
        Matches.sendScore($scope.currentTournament, match, $scope.scoreModalSets).then(function(data){
            alert(data);
            self.updateView();
        });
        $scope.scoreModal.hide();
    }
    $scope.sendSecondCallModal = function(match) {
        Matches.sendSecondCall($scope.currentTournament, match).then(function(data){
            alert(data);
        });
        $scope.secondCallModal.hide();
    }

})



.controller('RankingsCtrl', function($scope, Rankings) {
    Rankings.getDisciplines().then(function(data){
            $scope.disciplines = data;
        });

    var selectedDisciplineId = 0;
    $scope.selectedDiscipline = "Select discipline";
    $scope.showRanking = function(disciplineId, disciplineName) {
        $scope.isLoading = true;
        selectedDisciplineId = disciplineId;

        $scope.selectedDiscipline = disciplineName;
        Rankings.get(disciplineId).then(function(data){
            $scope.ranking = data;
            $scope.isLoading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.doRefresh = function() {
        if (selectedDisciplineId != 0) {
            $scope.showRanking(selectedDisciplineId, $scope.selectedDiscipline);
        } else {
            $scope.$broadcast('scroll.refreshComplete');
        }
    };
})

.controller('PlayersCtrl', function($scope, Matches) {
    $scope.searchPlayer = function(searchText) {
        if ((searchText == null) || (searchText == '')) {
            $scope.searchMatches = {};
        } else {
            $scope.isLoading = true;
            Matches.searchPlayer(searchText).then(function(data){
                $scope.searchMatches = data;
                $scope.isLoading = false;
            });
        }
    }
})

.controller('AppCtrl', function($scope, $ionicModal, $http, $ionicPopup, $localstorage, authService, $rootScope, $stateParams) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
//        $scope.loginData.username.trigger('focus');
    };

    // Open the logout alert
    $scope.logout = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Do you want to logout?'
        }).then(function(res) {
            if (res) {
                $localstorage.setObject('oauth', null);
                $rootScope.isLoggedin = false;
            }
        });
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        self.postData = {
            client_id: oAuthClientId,
            client_secret: oAuthClientSecret,
            grant_type: 'password',
            username: $scope.loginData.username,
            password: $scope.loginData.password
        };

        $http.post(apiUrl +'/oauth/token', postData).
            success(function(data, status, headers, config) {
                $localstorage.setObject('oauth', data);

                // retry requests with new token
                authService.loginConfirmed('success', function(config){
                    config.headers["Authorization"] = "Bearer "+ data.access_token;
                    return config;
                })

                $scope.closeLogin();
            }).
            error(function(data, status, headers, config) {
                console.error('Error while fetching oauth token');

                if (status == 400) {
                    // Show incorrect login alert
                    var alertPopup = $ionicPopup.alert({
                        title: 'Incorrect login',
                        template: 'Your username / password combination is not correct'
                    }).then(function(res) {
                        $scope.loginData.password = '';
                    });
                }
            });
    };

    // Handles incoming device tokens
    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        alert("Successfully registered token " + data.token);
        console.log('Ionic Push: Got token ', data.token, data.platform);
        $scope.token = data.token;
    });

    $rootScope.tournamentUrl = $stateParams.tournamentUrl;
})

.controller('TournamentsCtrl', function($scope, $localstorage, $http, $rootScope) {
    if ($rootScope.isLoggedin) {
        $http.get(apiUrl +'/mytournaments').
            success(function(data, status, headers, config) {
                $scope.mytournaments = data;
            });
    }

    $http.get(apiUrl +'/tournaments').
        success(function(data, status, headers, config) {
            $scope.alltournaments = data;
        });
})

.controller('InfoCtrl', function($scope, $stateParams, $localstorage, $http, $ionicLoading, Tournaments, $stateParams, $cordovaInAppBrowser) {
    $ionicLoading.show({
        templateUrl: 'templates/loadingPane.html'
    });

    $scope.openDesktopSite = function(url) {
        url = $scope.desktopUrl + $stateParams.tournamentUrl;
        $cordovaInAppBrowser.open(url, '_system');
    }

    Tournaments.getCurrentTournament().then(function(tournament){
        $scope.tournament = tournament;
        $ionicLoading.hide();
    });
})

.controller('TabsController', function($scope, $stateParams) {
    $scope.tournamentUrl = $stateParams.tournamentUrl;
})


.controller('SettingsController', function($scope, Settings, $rootScope) {;
        $scope.setNotificationsEnabled = function(enabled) {
        Settings.setNotificationsEnabled(enabled).then(function(data){
            console.log("successfully enabled");
            //$scope.searchMatches = data;
            //$scope.isLoading = false;
        });
    }
    $scope.notificationsNextMatch = 3;
    $scope.setNotificationsNextMatch = function(period) {
        Settings.setNotificationsNextMatch(period);
    }

    /*
    $scope.identifyUser = function() {
        alert('Identifying');
        console.log('Identifying user');

        var user = $ionicUser.get();
        if(!user.user_id) {
            // Set your user_id here, or generate a random one
            user.user_id = $ionicUser.generateGUID()
        };

        angular.extend(user, {
            name: 'Test User',
            message: 'I come from planet Ion'
        });

        $ionicUser.identify(user);

    }
     //$scope.identifyUser();
     */

});
