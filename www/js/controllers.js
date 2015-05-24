angular.module('tournia.controllers', [])


.controller('MatchesCtrl', function($scope) {
    $scope.todos =  [
        {name: "Do the dishes"},
        {name: "Take out the trash"}
    ]
    $scope.doRefresh = function() {
        $scope.todos.unshift({name: 'Incoming todo ' + Date.now()})
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply()
    };
        /*
    $http.get('/my_resource')
        .success(function(data) {
            $scope.resource = data.resource
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
        })*/
})

.controller('RankingsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }

    $scope.disciplineSelector = false;
    $scope.toggleDisciplineSelector = function() {
        $scope.disciplineSelector = !$scope.disciplineSelector;
    }

    $scope.selectedDisciplineId = 0;
    $scope.showRanking = function(disciplineId) {
        $scope.selectedDisciplineId = disciplineId;
    }
})

.controller('RankingDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

})

.controller('PlayersCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
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
        template: 'Loading...'
    });

    $http.get(apiUrl +'/tournaments/'+ $stateParams.tournamentId).
        success(function(data, status, headers, config) {
            $scope.tournament = data;
            $ionicLoading.hide();
        });
});