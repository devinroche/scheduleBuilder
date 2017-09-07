'use strict';

/**
 * @ngdoc service
 * @name scheduleBuilderApp.httpService
 * @description
 * # httpService
 * Service in the scheduleBuilderApp.
 */

const baseUrl = "https://schedule-builder-backend.herokuapp.com/api/";

angular.module('scheduleBuilderApp')
  .service('httpService', ['$http', function ($http) {
    this.getClasses = function() {
      return $http.get(baseUrl + 'classes');
    };

    this.postClass = function (obj) {
      return $http.post(baseUrl + "schedules", obj);
    };
    
  }]);
