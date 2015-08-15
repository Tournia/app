angular.module('tournia.deploy', [])

.run(['$ionicDeploy', function($ionicDeploy) {
    //$ionicDeploy.setChannel("dev");

    // Check for updates
    $ionicDeploy.check().then(function(response) {
        // response will be true/false
        if (response) {
            // Download the updates
            $ionicDeploy.download().then(function() {
                // Extract the updates
                $ionicDeploy.extract().then(function() {
                    // Load the updated version
                    $ionicDeploy.load();
                }, function(error) {
                    // Error extracting
                }, function(progress) {
                    // Do something with the zip extraction progress
                    $scope.extraction_progress = progress;
                });
            }, function(error) {
                // Error downloading the updates
            }, function(progress) {
                // Do something with the download progress
                $scope.download_progress = progress;
            });
        }
    },
    function(error) {
        // Error checking for updates
    })
}]);
