'use strict';

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scheduleBuilderApp
 */
angular.module('scheduleBuilderApp')
  .controller('AboutCtrl', function($scope, $http, $sce) {

    $http({
      method: 'GET',
      url: 'https://schedule-builder-backend.herokuapp.com/api/schedules/?courses=MATH_104'
    }).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(response);
    });
  });
