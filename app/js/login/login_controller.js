'use strict';

/* Controllers */

angular.module('login.controller', [])
    .controller('HomeCtrl', ['$scope', function ($scope) {
    }])
    .controller('UserCtrl', ['$scope', function ($scope) {
    }])
    .controller('LoginController', ['$scope', '$location', LoginController])
    .controller('LoginDirectiveController', ['$rootScope', '$scope', 'Auth', '$location', LoginDirectiveController]);


function LoginController($scope, $location) {
    $scope.redirectTo = function (route) {
        $location.path(route);
    }
}

function LoginDirectiveController($rootScope, $scope, Auth, $location) {
    $scope.login = function () {
        var credentials = {username: $scope.username, password: $scope.password};
        Auth.authenticate(credentials, function () {
            $scope.afterLogin();
        }, function (error) {
            $rootScope.alerts.push({ type: 'danger', msg: 'Login failed: ' + error });
        });
    };

    $scope.isAuthenticated = function () {
        return Auth.isAuthenticated();
    }

    $scope.logout = function () {
        Auth.logout(function () {
                $location.path('/');
            },
            function (error) {
                $rootScope.alerts.push({ type: 'danger', msg: 'There was an error: ' + error });
            });
    }
}



