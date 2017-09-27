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
  .controller("BuildCtrl", function($scope, $http, toastr, httpService) {
    $scope.allClasses = [];
    $scope.showBtns = false;

    $scope.clearAll = function() {
      $scope.viableSchedules = [];
      $scope.events = []
      viableSchedules = []
      $scope.showBtns = false;
      $scope.vSched = []
      schedCount = 0
      $scope.formatRequest = [];
      $scope.userClasses = [];
      $('#calendar').fullCalendar('removeEvents')
      toastr("warning", "Potential classes have been cleared");
    };

    console.time('class load')
    httpService.getClasses().then(function(r) {
      $scope.allClasses = r.data;
      console.timeEnd('class load')
      console.log('classes are ready to go!');
    });

    $scope.userClasses = [];
    $scope.addUserClasses = function(course) {
      $scope.userClasses.push(course);
    };

    $scope.edit = false;
    $scope.toggleEdit = function() {
      $scope.edit = !$scope.edit;
    };

    $scope.removeClass = function(classObj) {
      var idx = $scope.userClasses.indexOf(classObj);
      if (idx > -1) {
        $scope.userClasses.splice(idx, 1);
      }
      console.log($scope.userClasses);
    };
    
    $scope.events = []
    var schedCount = 0;
    var viableSchedules = [];
    $scope.viableSchedules = [];
    $scope.formatRequest = [];

    $scope.generateSchedule = function(classArr) {
      for (var i = 0; i < classArr.length; i++) {
        $scope.formatRequest.push(classArr[i].description);
      }

      if ($scope.formatRequest.length === 0) {
        toastr("error", "One or more classes required");
      } else {
        toastr("success", "Your schedules are being prepared!");
        var submissionObj = { classes: $scope.formatRequest, block: [] };
        httpService.postClass(submissionObj).then(function(r) {
          viableSchedules = r.data;
          $scope.viableSize = viableSchedules.length;
          $scope.showCount = schedCount + 1;
          $scope.vSched = viableSchedules[schedCount];
          $scope.showBtns = true;
          console.log($scope.vSched)
          var tmpTime = [];
          var tmpDay = [];
          for(var i =0; i < $scope.vSched.length; i++){
            tmpTime.push($scope.vSched[i].Times.split(" "));
            tmpDay.push($scope.vSched[i].Days);
          }
          time2utc(tmpTime, tmpDay)
        });
      }
    }; 
    
    var time2utc = function(timeArr, dayArr){
      for(var i=0; i<timeArr.length; i++){
        var tmpVar = timeArr[i].splice(0, 1);
        var dow = []
        if (dayArr[i] == 'MWF'){
          dow = [1, 3, 5]
        }else if(dayArr[i] == 'TR'){
          dow=[2,4]
        }else if(dayArr[i] == 'MW'){
          dow = [1, 3]
        }
        console.log(dow)
        if (tmpVar !== '-'){
          tmpVar = tmpVar.pop().slice(0, 7);
          tmpVar= moment(tmpVar,["h:mmA"]).format("HH:mm")
          // scheduleUtc.push(tmpVar);

          var eventObj = {
            title: $scope.vSched[i].Class,
            start: tmpVar,
            dow: dow
          }
          $scope.events.push(eventObj)
        }
      }
      $('#calendar').fullCalendar('addEventSource', $scope.events);
      $('#calendar').fullCalendar('rerenderEvents');
      $scope.showCalendar();
    }

    $scope.showCalendar = function(){

      $(document).ready(function() {
        $('#calendar').fullCalendar({
          defaultView: 'agendaWeek',
          defaultDate: '2017-09-25',
          allDaySlot: false,
          weekends: false,
          header:false,
          minTime: "08:00:00",
          maxTime: "21:00:00",
          contentHeight: 600,
          events: $scope.events
        });
      });
    }

    // Next and Prev page loads the schedule before or after your current schedule!
    $scope.nextPage = function() {
      if (schedCount === $scope.viableSize - 1) {
        schedCount = 0;
      } else {
        schedCount = schedCount + 1;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
    };
    $scope.prevPage = function() {
      if (schedCount === 0) {
        schedCount = $scope.viableSize - 1;
      } else {
        schedCount = schedCount - 1;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
    };

    $scope.moreInfo = function(classInfo){
      console.log(classInfo)
    };

  });