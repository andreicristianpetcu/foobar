'use strict';

/* Services */

angular.module('user.userService', ['ngCookies', 'http-auth-interceptor'])
    .value('version', '0.1')

    .factory('Users', ['$http', 'USER_URLS', function ($http, USER_URLS) {
        function getUsers(successCallback, errorCallback) {
            $http.post(USER_URLS.USERS)
                .success(function (data) {
                    successCallback(data);
                })
                .error(errorCallback);
        }

        //TODO: test me pls
        function getUser(userId, successCallback, errorCallback) {
            $http.get(USER_URLS.USER + '/' + userId)
                .success(function (data) {
                    successCallback(data);
                })
                .error(function (error) {
                    errorCallback(error);
                });
        }

        //TODO: test me pls
        function updateUser(user) {
            return $http.post(USER_URLS.USER, user);
        }

        return {
            getUsers: getUsers,
            getUser: getUser,
            updateUser: updateUser
        };
    }])

    .constant('USER_URLS', {
        USERS: 'http://libraryapp.cegeka.com:8080/backend/rest/users',
        USER: 'http://libraryapp.cegeka.com:8080/backend/rest/user'
    });

