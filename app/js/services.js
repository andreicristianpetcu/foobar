'use strict';

/* Services */

angular.module('userAdmin.services', ['ngCookies', 'http-auth-interceptor'])
    .value('version', '0.1')

    .factory('Alerts', ['$rootScope', function ($rootScope) {
        function genericErrorHandler(response) {
            var status = response.status;
            var headers = response.headers;
            var config = response.config;
            var data = response.data;

            var errorMessage;
            if (status === 0) {
                errorMessage = 'Timeout while accessing ' + config.url;
            } else {
                errorMessage = 'Accessing ' + config.url + ' returned with status code: ' + status + " \r\n" + data;
            }
            dangerHandler(errorMessage);
        }

        function successHandler(message) {
            $rootScope.alerts.push({msg: message, type: "success" });
        }

        function dangerHandler(message) {
            $rootScope.alerts.push({msg: message, type: "danger" });
        }

        return {
            handler: genericErrorHandler,
            successHandler: successHandler,
            dangerHandler: dangerHandler
        }
    }])

