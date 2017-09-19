'use strict';

/**
 * @ngdoc overview
 * @name scheduleBuilderApp
 * @description
 * # scheduleBuilderApp
 *
 * Main module of the application.
 */
angular
  .module('scheduleBuilderApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angucomplete-alt'
  ])
  .config(function($routeProvider, $locationProvider, $sceDelegateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
      })
      .when('/build', {
        templateUrl: 'views/build.html',
        controller: 'BuildCtrl',
        controllerAs: 'build'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
      })
      .otherwise({
        redirectTo: '/'
      });
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://schedule-builder-backend.herokuapp.com/**'
    ]);
    $locationProvider.hashPrefix('');
  });
