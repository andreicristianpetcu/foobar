'use strict';

/* Services */

angular.module('login.service', ['ngCookies', 'http-auth-interceptor'])
    .value('version', '0.1')

    .factory('Auth', ['$http', 'LOGIN_URLS', '$cookieStore', function ($http, LOGIN_URLS, $cookieStore) {
        var user = {userId: '', roles: []};

        if ($cookieStore.get('user') !== undefined) {
            angular.extend(user, $cookieStore.get('user'));
        }

        function userHasRole(user, role) {
            return _.indexOf(user.roles, role) !== -1;
        }

        function routeDoesNotRequireAuthentication(route) {
            return route.role === undefined;
        }

        function isAuthorizedToAccess(route) {
            return  routeDoesNotRequireAuthentication(route) || userHasRole(user, route.role);
        }

        function isAuthenticated() {
            return !_.isEmpty(user.userId.trim());
        }

        function authenticate(credentials, successCallback, errorCallback) {
            $http.post(LOGIN_URLS.LOGIN, credentials,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    transformRequest: function (data) {
                        return $.param(data);
                    },
                    ignoreAuthModule: true
                })
                .success(function (response) {
                    angular.copy(response, user);
                    $cookieStore.put('user', user);
                    successCallback();
                }).error(function (error) {
                    errorCallback(error);
                });

        }

        function getAuthenticatedUser() {
            var copiedUser = {};
            angular.copy(user, copiedUser);
            return copiedUser;
        }

        function logout(successCallback, errorCallback) {
            $cookieStore.remove('user');
            user.userId = '';
            user.roles = [];
            $http.post(LOGIN_URLS.LOGOUT, {}, {ignoreAuthModule: true}).success(
                function () {
                    if (!_.isUndefined(successCallback)) {
                        successCallback();
                    }
                }).error(function (error) {
                    if (!_.isUndefined(errorCallback)) {
                        errorCallback(error);
                    }
                });
        }

        return {
            authenticate: authenticate,
            getAuthenticatedUser: getAuthenticatedUser,
            isAuthorizedToAccess: isAuthorizedToAccess,
            isAuthenticated: isAuthenticated,
            logout: logout
        };
    }])

    .constant('LOGIN_URLS', {
        LOGIN: 'http://libraryapp.cegeka.com:8080/backend/j_spring_security_check',
        LOGOUT: 'http://libraryapp.cegeka.com:8080/backend/j_spring_security_logout',
    });

