// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'tournia' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'tournia.services' is found in services.js
// 'tournia.controllers' is found in controllers.js
angular.module('tournia', ['ionic', 'tournia.controllers', 'tournia.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html"
            }
        }
    })

    .state('app.settings2', {
        url: '/rankings2',
        views: {
            'tab-rankings': {
                templateUrl: 'templates/tab-rankings.html',
                controller: 'RankingsCtrl'
            }
        }
    })

    .state('app.tournaments', {
        url: "/tournaments",
        views: {
            'menuContent': {
                templateUrl: "templates/tournaments.html",
                controller: 'TournamentsCtrl'
            }
        }
    })

    .state('app.playlist', {
        url: "/playlist/:playlistId",
        views: {
            'menuContent': {
                templateUrl: "templates/playlist.html",
                controller: 'TournamentCtrl'
            }
        }
    })

    // Each tournament has its own nav history stack:
    .state('app.tournament', {
        url: "/t/:playlistId",
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: "templates/tabs.html"
            }
        }
    })

    .state('app.tournament.info', {
        url: '/info',
        views: {
            'tab-info': {
                templateUrl: 'templates/tab-info.html',
                controller: 'InfoCtrl'
            }
        }
    })

    .state('app.tournament.matches', {
        url: '/matches',
        views: {
            'tab-matches': {
                templateUrl: 'templates/tab-matches.html',
                controller: 'MatchesCtrl'
            },
            'menuContent': {
                templateUrl: "templates/tabs.html"
            }

        }
    })

    .state('app.tournament.rankings', {
        url: '/rankings',
        views: {
            'tab-rankings': {
                templateUrl: 'templates/tab-rankings.html',
                controller: 'RankingsCtrl'
            }
        }
    })

    .state('app.tournament.ranking-detail', {
        url: '/rankings/:chatId',
        views: {
            'tab-rankings': {
                templateUrl: 'templates/ranking-detail.html',
                controller: 'RankingDetailCtrl'
            }
        }
    })

    .state('app.tournament.players', {
        url: '/players',
        views: {
            'tab-players': {
                templateUrl: 'templates/tab-players.html',
                controller: 'PlayersCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/tournaments');

});
