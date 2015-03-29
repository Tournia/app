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
})

.controller('RankingDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PlayersCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('AppCtrl', function($scope, $ionicModal, $http, $ionicPopup, $localstorage) {
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
        console.log($scope.loginData);
//        $scope.loginData.username.trigger('focus');
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        self.postData = {
            client_id: '7_28vnh8348eskogg8080kok80o04owg404s0kk8c8okok8ccs84',
            client_secret: '5grrcukg2e0w8k8swog8k0k00g40kssgw0kk8cwccs4ko4kok4',
            grant_type: 'password',
            username: $scope.loginData.username,
            password: $scope.loginData.password
        };

        $http.post('http://192.168.50.4/app_dev.php/api/v2/oauth/token', postData).
            success(function(data, status, headers, config) {
                $localstorage.setObject('oauth', data);
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

.controller('TournamentsCtrl', function($scope, $localstorage, $http) {

    var accessToken = $localstorage.getObject('oauth').access_token;

    $http.get('http://192.168.50.4/app_dev.php/api/v2/mytournaments?access_token='+ accessToken).
        success(function(data, status, headers, config) {
            $scope.mytournaments = data;
        });

    $http.get('http://192.168.50.4/app_dev.php/api/v2/tournaments?access_token='+ accessToken).
        success(function(data, status, headers, config) {
            $scope.alltournaments = data;
        });
})

.controller('InfoCtrl', function($scope, $stateParams, $localstorage, $http, $ionicLoading) {
    var accessToken = $localstorage.getObject('oauth').access_token;

    $ionicLoading.show({
        template: 'Loading...'
    });

    $http.get('http://192.168.50.4/app_dev.php/api/v2/tournaments/'+ $stateParams.tournamentId +'?access_token='+ accessToken).
        success(function(data, status, headers, config) {
            $scope.tournament = data;
            $ionicLoading.hide();
        });
});