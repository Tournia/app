angular.module('tournia.controllers', [])


.controller('MatchesCtrl', function($scope, Matches) {
    $scope.doRefresh = function() {
        self.updateView();
    };

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

.controller('AppCtrl', function($scope, $ionicModal, $http, $ionicPopup, $localstorage, authService, $rootScope) {
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
})

.controller('TournamentsCtrl', function($scope, $localstorage, $http, $rootScope) {
    $http.get(apiUrl +'/mytournaments').
        success(function(data, status, headers, config) {
            $scope.mytournaments = data;
        });

    $http.get(apiUrl +'/tournaments').
        success(function(data, status, headers, config) {
            $scope.alltournaments = data;
        });
})

.controller('InfoCtrl', function($scope, $stateParams, $localstorage, $http, $ionicLoading) {
    $ionicLoading.show({
        templateUrl: 'templates/loadingPane.html'
    });

    $http.get(apiUrl +'/'+ $stateParams.tournamentUrl +'/tournament').
        success(function(data, status, headers, config) {
            $scope.tournament = data;
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
