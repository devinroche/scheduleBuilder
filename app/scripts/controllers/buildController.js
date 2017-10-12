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
  .controller("BuildCtrl", function($scope, $http, toastr, httpService, $fancyModal) {
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
    var colorPicker = ["#ff4444", "#ffbb33", "#00C851", "#33b5e5", "#2BBBAD", "#4285F4", "#aa66cc"]
    var colorBorder = ["#CC0000", "#FF8800", "#007E33", "#0099CC", "#00695c", "#0d47a1", "#9933CC"]

    var prepareCalendar = function (){
      var timeArr = [];
      var dayArr = [];
      for(var i =0; i < $scope.vSched.length; i++){
        timeArr.push($scope.vSched[i].Times.split(" "));
        dayArr.push($scope.vSched[i].Days);
      }
      time2utc(timeArr, dayArr)
    }

    var stringToColour = function(str) {
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var colour = '#';
      for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
      }

      return colour;
    }

    var time2utc = function(timeArr, dayArr){
      for(var i=0; i<timeArr.length; i++){
        var startTime = timeArr[i].splice(0, 1);
        var endTime = timeArr[i].splice(1, 2);
        var dow = []
        var duration;

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

        if (startTime !== '-' && endTime !== '-'){
          startTime = startTime.pop().slice(0, 7);
          startTime= moment(startTime,["h:mmA"]).format("HH:mm")

          endTime = endTime.pop().slice(0,7);
          endTime = moment(endTime, ["h:mmA"]).format("HH:mm")

          var eventObj = {
            title: $scope.vSched[i].Class,
            start: startTime,
            end: endTime,
            dow: dow,
            backgroundColor: colorPicker[i],
            borderColor: colorBorder[i]
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
          events: $scope.events,
          eventClick: function(event) {
              $scope.moreInfo(event)
          }
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
      $scope.classInformation;
      console.log($scope.vSched)
      for(var i=0; i<$scope.vSched.length; i++){
        if($scope.vSched[i].Class === classInfo.title){
          console.log($scope.vSched[i])
          $scope.classInformation = $scope.vSched[i]
          $fancyModal.open({ 
            templateUrl: '../../views/modal1.html' ,
            scope: $scope
          });
          $('.fancymodal-overlay fancymodal-overlay-opening').removeClass('fancymodal-overlay fancymodal-overlay-opening')
          $( ".fancymodal-content" ).removeClass('fancymodal-content').addClass('modal-content modal-dialog')
        }
      }
    };

  });