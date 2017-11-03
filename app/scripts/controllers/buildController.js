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
  .controller("BuildCtrl", function ($scope, $http, toastr, httpService, calendarService, eventService, $fancyModal) {

    // Init Variables
    $scope.allClasses = [];
    $scope.userClasses = [];
    $scope.events = []
    var viableSchedules = [];
    $scope.viableSchedules = [];
    $scope.formatRequest = [];
    $scope.showBtns = false;
    $scope.edit = false;
    $scope.classpick = false;
    var schedCount = 0;
    $scope.inputWait = true;
    $scope.noSchedules = false;

    $scope.clearAll = function () {
      $scope.classpick = false;
      $scope.viableSchedules = [];
      $scope.events = []
      viableSchedules = []
      $scope.noSchedules = false;
      $scope.showBtns = false;
      $scope.vSched = []
      schedCount = 0
      $scope.formatRequest = [];
      $scope.userClasses = [];
      $('#calendar').fullCalendar('removeEvents')
      toastr("warning", "Potential classes have been cleared");
    };

    httpService.getClasses().then(function (r) {
      $scope.allClasses = r.data;
      $scope.inputWait = false;
      console.log($scope.allClasses)
    });

    $scope.addUserClasses = function (course) {
      $scope.classpick = true;
      $scope.userClasses.push(course);
    };

    $scope.toggleEdit = function () {
      $scope.edit = !$scope.edit;
    };

    $scope.removeClass = function (classObj) {
      var idx = $scope.userClasses.indexOf(classObj);
      if (idx > -1) {
        $scope.userClasses.splice(idx, 1);
      }
      console.log($scope.userClasses)
    };

    var clearCalendar = function () {
      $('#calendar').fullCalendar('removeEvents')
      $scope.events = []
    }

    $scope.generateSchedule = function (classArr) {
      console.log(classArr)
      $scope.formatRequest = []
      $scope.noSchedules = false;
      clearCalendar()
      for (var i = 0; i < classArr.length; i++) {
        $scope.formatRequest.push(classArr[i].description);
      }
      if ($scope.formatRequest.length === 0) {
        toastr("error", "One or more classes required");
      } else {
        toastr("success", "We are cookin up your schedules!");
        var submissionObj = {
          classes: $scope.formatRequest,
          block: []
        };
        httpService.postClass(submissionObj).then(function (r) {
          console.log(r.data)
          viableSchedules = r.data;
          $scope.viableSize = viableSchedules.length;
          $scope.showCount = schedCount + 1;
          $scope.vSched = viableSchedules[schedCount];
          $scope.showBtns = true;
          prepareCalendar()
        });
      }
    };

    var prepareCalendar = function () {
      var timeArr = [];
      var dayArr = [];
      if(typeof($scope.vSched) === 'undefined'){
        noSchedules()
      }
      else{
        for (var i = 0; i < $scope.vSched.length; i++) {
          dayArr.push($scope.vSched[i].week);
        }
        
        time2utc(dayArr)
      }
    }

    var colorPicker = ["#ff4444", "#ffbb33", "#00C851", "#33b5e5", "#2BBBAD", "#4285F4", "#aa66cc", "#29b6f6", "#f06292"]
    var colorBorder = ["#CC0000", "#FF8800", "#007E33", "#0099CC", "#00695c", "#0d47a1", "#9933CC", "#039be5", "#ec407a"]

    var time2utc = function (dayArr) {
      for (var i = 0; i < dayArr.length; i++) {
      
        var eventObj = eventService.eventObj(
          eventService.startTime(dayArr[i]),
          eventService.endTime(dayArr[i]),
          $scope.vSched[i].title, 
          eventService.getDow(dayArr[i])
        )
        eventObj.backgroundColor = colorPicker[i]
        eventObj.borderColor = colorBorder[i]

        console.log(eventObj)
        $scope.events.push(eventObj)
      }

      calendarService.reloadCal($scope.events)
      $scope.showCalendar();
    }

    $scope.nextPage = function () {
      clearCalendar()
      if (schedCount === $scope.viableSize - 1) {
        schedCount = 0;
      } else {
        schedCount++;
      }
      editCount()
    };

    $scope.prevPage = function () {
      clearCalendar()
      if (schedCount === 0) {
        schedCount = $scope.viableSize - 1;
      } else {
        schedCount = schedCount - 1;
      }
      editCount()
    };

    var editCount = function () {
      $scope.showCount = schedCount + 1;
      $scope.vSched = viableSchedules[schedCount];
      prepareCalendar()
    }

    var noSchedules = function (){
      $scope.noSchedules = true;
      $scope.showBtns = false;
    }

    //Calendar Functions
    $scope.showCalendar = function () {
      $(document).ready(function () {
        $('#calendar').fullCalendar({
          defaultView: 'agendaWeek',
          defaultDate: '2017-09-25',
          allDaySlot: false,
          weekends: false,
          header: false,
          minTime: "08:00:00",
          maxTime: "21:00:00",
          height: 480,
          events: $scope.events,
          eventClick: function (event) {
            moreInfo(event)
          }
        });
      })
    }

    var moreInfo = function (classInfo) {
      for (var i = 0; i < $scope.vSched.length; i++) {
        if ($scope.vSched[i].Class === classInfo.title) {
          $scope.classInformation = $scope.vSched[i]
          $fancyModal.open({
            templateUrl: '../../views/classModal.html',
            scope: $scope
          });
          $('.fancymodal-overlay fancymodal-overlay-opening').removeClass('fancymodal-overlay fancymodal-overlay-opening')
          $(".fancymodal-content").removeClass('fancymodal-content').addClass('modal-content modal-dialog')
        }
      }
    };

  });
