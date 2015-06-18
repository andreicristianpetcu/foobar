'use strict';

// Declare app level module which depends on filters, and services
angular.module('userAdmin', ['ngRoute', 'ui.bootstrap', 'userAdmin.filters', 'userAdmin.services',
    'userAdmin.directives', 'login', 'book', 'user'])
    .config(['$routeProvider', function ($routeProvider) {
        //TODO - config routeProvier in each module? (login/book/user). What about the otherwise?
        $routeProvider
            .when('/', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'})
            .when('/users', {templateUrl: 'partials/users.html', controller: 'UsersController', role: 'ADMIN'})
            .when('/user/:id', {templateUrl: 'partials/user.html', controller: 'UserController', role: 'ADMIN'})
            .when('/books', {templateUrl: 'partials/books.html', controller: 'BooksController', role: 'ADMIN'})
            .when('/book/:bookId', {templateUrl: 'partials/show_book.html', controller: 'BooksController', role: 'ADMIN'})
            .when('/add_book', {templateUrl: 'partials/add_book.html', controller: 'BooksController', role: 'ADMIN'})
            .otherwise({redirectTo: '/'});
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])
    .run(function ($rootScope, $location, Auth) {
        $rootScope.alerts = [];
        $rootScope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };

        $rootScope.$on('$routeChangeStart', function (event, next, previous, rejection) {
            $rootScope.alerts = [];
            var isAuthorized = Auth.isAuthorizedToAccess(next);
            var isAuthenticated = Auth.isAuthenticated();
            if (!isAuthenticated){
                if (previous != undefined){
                    $rootScope.alerts.push({msg: 'You need to login to access this page', type: 'danger'})
                    $location.path('/')
                }
            }else
            if(!isAuthorized ) {
                $location.path('/')
                $rootScope.alerts.push({msg:'You are not authorized to access this page', type: 'danger'})
            }
        });

        $rootScope.$on('event:auth-loginRequired', function (event, response) {
          console.log('Login required!. Response status: ' + response.status);
          $location.path('/');
        });
    });
