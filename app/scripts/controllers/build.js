"use strict";

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
const baseUrl = "http://schedule-builder-backend.herokuapp.com/api";

angular
  .module("scheduleBuilderApp")
  .controller("BuildCtrl", function($scope, $http, toastr) {
    $scope.allClasses = [];

    $scope.clearAll = function() {
      $scope.viableSchedules = [];
      $scope.preReqClasses = [];
      $scope.userClasses = [];
      toastr("warning", "Potential classes have been cleared");
    };
    $http({
      method: "GET",
      url: baseUrl + "/classes"
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

    $scope.removeClass = function(classObj){
      console.log(classObj)
      var idx = $scope.userClasses.indexOf(classObj);
      console.log(idx)
      if (idx > -1) {
        $scope.userClasses.splice(idx, 1);
      }
    }

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

      if ($scope.preReqClasses.length == 0) {
        toastr("error", "One or more classes required");
      } else {
        toastr("success", "Your schedules are being generated!");
        $http({
          method: "POST",
          data: { classes: $scope.preReqClasses, block: [] },
          url: baseUrl + "/schedules"
        }).then(
          function successCallback(response) {
            $scope.viableSchedules = response.data;
            console.log($scope.viableSchedules);
          },
          function errorCallback(response) {
            console.log("fail");
          }
        );
      }
    };
  });
