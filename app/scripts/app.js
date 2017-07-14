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
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/build', {
        templateUrl: 'views/build.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  });
