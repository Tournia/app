// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'tournia' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'tournia.services' is found in services.js
// 'tournia.controllers' is found in controllers.js
angular.module('tournia', ['ionic','ionic.service.core','ionic.service.push','ngCordova', 'tournia.controllers', 'tournia.services', 'http-auth-interceptor'])

.run(function($ionicPlatform, $rootScope, $injector, authService, $localstorage, $http) {
    $rootScope.$on('event:auth-loginRequired', function(event, data){
        // logged out -> check refresh token
        $rootScope.isLoggedin = false;
        if ($localstorage.getObject('oauth') != null) {
            var postData = {
                client_id: oAuthClientId,
                client_secret: oAuthClientSecret,
                grant_type: 'refresh_token',
                refresh_token: $localstorage.getObject('oauth').refresh_token
            };

            $http.post(apiUrl +'/oauth/token', postData)
                .success(function(data, status, headers, config) {
                    $localstorage.setObject('oauth', data);

                    // retry requests with new token
                    authService.loginConfirmed('success', function(config){
                        config.headers["Authorization"] = "Bearer "+ data.access_token;
                        return config;
                    })
                })
                .error(function(data, status, headers, config) {
                    console.error('Error while refreshing oauth token');
                    if (status == 400) {
                        // Incorrect refresh token
                        authService.loginCancelled();
                        // TODO: open login window
                    }
                });
        }
    });
    $rootScope.$on('event:auth-loginConfirmed', function(event, data){
        $rootScope.isLoggedin = true;
    });


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

    $rootScope.hrefPrefix = (webMode) ? '' : '#/';
    $rootScope.webMode = webMode;
    $rootScope.desktopUrl = desktopUrl;
})

.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


    .state('app', {
        url: "/",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.settings', {
        url: "settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsController'
            }
        }
    })

    .state('app.tournaments', {
        url: "tournaments",
        views: {
            'menuContent': {
                templateUrl: "templates/tournaments.html",
                controller: 'TournamentsCtrl'
            }
        }
    })

    // Each tournament has its own nav history stack:
    .state('app.tournament', {
        url: "t/:tournamentUrl",
        abstract: true,
        views: {
            'menuContent': {
                templateUrl: "templates/tabs.html"
            }
        }
    })

    .state('app.tournament.info_redirect', {
        url: '/',
        views: {
            'tab-info': {
                templateUrl: 'templates/tab-info.html',
                controller: 'InfoCtrl'
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
    $urlRouterProvider.otherwise('/tournaments');

})

.config(['$ionicAppProvider', function($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
        // The App ID (from apps.ionic.io) for the server
        app_id: 'd27f8b9e',
        // The public API key all services will use for this app
        api_key: '395de2625c7d8c446f1c26dd715585b37f301e28da8b7719',
        dev: false
    });
}])

.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(webMode);
}]);
