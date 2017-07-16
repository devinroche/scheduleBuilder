"use strict";

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
angular
  .module("scheduleBuilderApp")
  .controller("AboutCtrl", function($scope, $http) {
    $scope.searchObj = "";
    $scope.resultArr = [];
    $scope.allClasses = [];

    $scope.submitSearch = function(searchParams) {
      let searchFormat = "?courses=" + searchParams;
      $http({
        method: "GET",
        url:
          "https://schedule-builder-backend.herokuapp.com/api/schedules/" +
          searchFormat
      }).then(
        function successCallback(response) {
          $scope.resultArr = response.data;
          console.log($scope.response.data);
        },
        function errorCallback(response) {
          console.log(response);
        }
      );
    };
    $http({
      method: "GET",
      url: "http://schedule-builder-backend.herokuapp.com/api/classes"
    }).then(
      function successCallback(response) {
        $scope.allClasses = response.data;
        console.log($scope.allClasses);
      },
      function errorCallback(response) {
        console.log(response);
      }
    );

    $scope.userClasses = [];
    $scope.addUserClasses = function(val) {
      $scope.userClasses.push(val);
    };

    $scope.viableSchedules = [];
    $scope.preReqClasses = [];
    $scope.generateSchedule = function(classArr) {
      for (var i = 0; i < classArr.length; i++) {
        $scope.preReqClasses.push(
          classArr[i].originalObject.Subject +
            " " +
            classArr[i].originalObject.Course
        );
      }
      $http({
        method: "POST",
        data: { classes: $scope.preReqClasses, block: [] },
        url: "https://schedule-builder-backend.herokuapp.com/API/schedules"
      }).then(
        function successCallback(response) {
          console.log("success")
          $scope.viableSchedules = response.data;
          console.log($scope.viableSchedules)
      },
      function errorCallback(response) {
        console.log("fail")
        console.log(response);
      }
      );
    };
  });
