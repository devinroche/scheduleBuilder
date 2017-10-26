'use strict';

angular.module('scheduleBuilderApp')
  .service('eventService', function () {

    this.getDow = function(day) {
        var dow = []

        if (day == 'MWF'){
            dow = [1, 3, 5]
          }else if(day == 'TR'){
            dow=[2,4]
          }else if(day == 'MW'){
            dow = [1, 3]
          }else if(day == 'WF'){
            dow = [3, 5]
          }else if(day == 'T'){
            dow = [2]
          }else if(day == 'R'){
            dow = [4]
          }else if(day == 'M'){
            dow = [1]
          }else if(day == 'W'){
            dow = [3]
          }else if(day == 'F'){
            dow = [4]
          }

        return dow
    };

    this.startTime = function (timeStr) {
        return timeStr.splice(0, 1);
    };

    this.endTime = function(timeStr){
        return timeStr.splice(1, 2);
    }

    this.eventObj = function(startTime, endTime, className, dow){
        if (startTime !== '-' && endTime !== '-'){
            startTime = startTime.pop().slice(0, 7);
            startTime= moment(startTime,["h:mmA"]).format("HH:mm")
  
            endTime = endTime.pop().slice(0,7);
            endTime = moment(endTime, ["h:mmA"]).format("HH:mm")
            
            var eventObj = {
                title: className,
                start: startTime,
                end: endTime,
                dow: dow,
                backgroundColor: "",
                borderColor: ""
            }

            return eventObj
        }

    }
    
  });
