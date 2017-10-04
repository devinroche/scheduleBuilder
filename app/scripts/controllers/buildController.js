"use strict";

/**
 * @ngdoc function
 * @name scheduleBuilderApp.controller:Build
 * @description
 * # Build
 * Controller of the scheduleBuilderApp
 */
angular
  .module("scheduleBuilderApp")
  .controller("BuildCtrl", function($scope, $http, toastr, httpService) {
    $scope.allClasses = [];
    $scope.showBtns = false;
    $scope.classpick = false;
    $scope.clearAll = function() {
      $scope.classpick = false;
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
      console.log(r.data)
      console.timeEnd('class load')
      console.log('classes are ready to go!');
    });

    $scope.userClasses = [];
    $scope.addUserClasses = function(course) {
      $scope.classpick = true;
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

    var clearCalendar = function(){
      $('#calendar').fullCalendar('removeEvents')
      $scope.events = []
    }

    $scope.generateSchedule = function(classArr) {
      clearCalendar()
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
          prepareCalendar()
        });
      }
    }; 
    
    var prepareCalendar = function (){
      var tmpTime = [];
      var tmpDay = [];
      for(var i =0; i < $scope.vSched.length; i++){
        tmpTime.push($scope.vSched[i].Times.split(" "));
        tmpDay.push($scope.vSched[i].Days);
      }
      time2utc(tmpTime, tmpDay)
    }

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
        }else if(dayArr[i] == 'WF'){
          dow = [3, 5]
        }else if(dayArr[i] == 'T'){
          dow = [2]
        }else if(dayArr[i] == 'R'){
          dow = [4]
        }else if(dayArr[i] == 'M'){
          dow = [1]
        }else if(dayArr[i] == 'W'){
          dow = [3]
        }else if(dayArr[i] == 'F'){
          dow = [4]
        }
        if (tmpVar !== '-'){
          tmpVar = tmpVar.pop().slice(0, 7);
          tmpVar= moment(tmpVar,["h:mmA"]).format("HH:mm")

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
          height: 480,
          events: $scope.events
        });
      });
    }

    // Next and Prev page loads the schedule before or after your current schedule!
    $scope.nextPage = function() {
      clearCalendar()
      if (schedCount === $scope.viableSize - 1) {
        schedCount = 0;
      } else {
        schedCount++;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
      prepareCalendar()
    };
    $scope.prevPage = function() {
      clearCalendar()
      if (schedCount === 0) {
        schedCount = $scope.viableSize - 1;
      } else {
        schedCount = schedCount - 1;
      }
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
      prepareCalendar()
    };

    $scope.moreInfo = function(classInfo){
      console.log(classInfo)
    };

  });
  