angular.module('tournia.controllers', [])


.controller('InfoCtrl', function($scope) {})

.controller('MatchesCtrl', function($scope) {})

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

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('TournamentsCtrl', function($scope) {
    $scope.playlists = [
        { title: 'ISBT 1', id: 1 },
        { title: 'ISBT 2', id: 2 },
        { title: 'Tournament 3', id: 3 },
        { title: 'Blabla', id: 4 },
        { title: 'Asfd', id: 5 },
        { title: 'Tourney', id: 6 }
    ];
})

.controller('TournamentCtrl', function($scope, $stateParams) {
});