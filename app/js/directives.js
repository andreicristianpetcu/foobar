'use strict';
var app = angular.module('userAdmin.directives', []);

app.directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('sidebarActions', function () {
        return {
            restrict: 'E',
            templateUrl: 'directive/sidebar-actions.html',
            scope: {
                title: "=",
                items: "=",
                action: "&onAction"
            },

            link: function (scope, directiveElement, attrs) {
                scope.title = attrs.title;

                scope.isActive = function (which) {
                    return which === activeMenuItem;
                }

                scope.selectMenuItem = function (index) {
                    scope.action({action: scope.items[index]});
                }
            }
        }
    });

app.directive("clickToEdit", [ "$parse", "Alerts", function($parse, Alerts) {
    return {
        restrict: "A",
        replace: true,
        template: '<div ng-include src="\'partials/directives/clickToEdit.html\'" />',
        scope: {
            value: "=clickToEditValue",
            callback: "=clickToEditSave",
            isValidCallback: "=clickToEditIsValid"
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function () {
                $scope.disableEditor();
                var validationMessage = $scope.isValidCallback($scope.value, $scope.view.editableValue);
                if (validationMessage == "VALID") {
                    $scope.value = $scope.view.editableValue;
                    $scope.callback($scope.value);
                } else {
                    Alerts.dangerHandler(validationMessage);
                }
            };
        }
    };
}]);
