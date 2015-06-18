'use strict';

/* Controllers */

angular.module('user.userController', [])
  .controller('UsersController', ['$rootScope', 'Users', '$scope','$location','Alerts', UsersController])
  .controller('UserCtrl', [function () {
  }]);


function UsersController($rootScope, Users, $scope, $location, Alerts) {
    Users.getUsers(
        function success(responseData) {
            $scope.users = responseData;
        },
        Alerts.handler
    );


    var MENU_ACTION_IDS = {
        ACTION_1: 'ACTION_1'
    }

    $scope.sidebarMenuItems = [
        {id: MENU_ACTION_IDS.ACTION_1, text: 'Action 1' }
    ];


    $scope.sidebarActionSelected = function (sidebarAction) {
        console.log(sidebarAction);
        alert(sidebarAction.text + " was clicked");
    }
}

function UserController(Users, $scope, $routeParams, $location) {

  $scope.rolesModel = {'ADMIN': false, 'USER': false};
  function updateRolesViewModelFromUser(model, user) {
    user.roles.forEach(function (role) {
      model[role] = true;
    });
  }

  function updateUserFromRolesViewModel(user, model) {
    var roles = [];
    _.keys(model).forEach(function (role) {
      if (model[role] === true) {
        roles.push(role);
      }
    });
    user.roles = roles;

  }

  Users.getUser($routeParams.id,
    function success(responseData) {
      $scope.user = responseData;
      updateRolesViewModelFromUser($scope.rolesModel, $scope.user);
    },
    function error(error) {
      var x = 0;
      // for now do nothing. feel free to add here error messages on scope if you want/need to
    });

  $scope.updateUser = function () {
    updateUserFromRolesViewModel($scope.user, $scope.rolesModel);
    Users.updateUser($scope.user)
      .then(function () {
        $location.path('/users');

      }, function error() {

      })
  }
}