'use strict';

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
angular.module('scheduleBuilderApp')
  .controller('AboutCtrl', function ($scope, $http) {
    $scope.searchObj = "";
    $scope.resultArr = [];
    $scope.allClasses = [];
    $scope.submitSearch = function (searchParams) {
      let searchFormat = "?courses=" + searchParams;
      $http({
        method: 'GET',
        url: 'https://schedule-builder-backend.herokuapp.com/api/schedules/' + searchFormat
      }).then(function successCallback(response) {
        $scope.resultArr = response.data;
        console.log($scope.resultArr);
      }, function errorCallback(response) {
        console.log(response);
      });
    };
    $http({
      method: 'GET',
      url: 'http://schedule-builder-backend.herokuapp.com/api/classes'
    }).then(function successCallback(response) {
      $scope.allClasses = response.data;
      console.log($scope.allClasses);
    }, function errorCallback(response) {
      console.log(response);
    });

    
  });
