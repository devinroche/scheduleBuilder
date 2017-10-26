'use strict';

angular.module('scheduleBuilderApp')
  .service('calendarService', function ($fancyModal) {

    this.reloadCal = function(events) {
        $('#calendar').fullCalendar('addEventSource', events);
        $('#calendar').fullCalendar('rerenderEvents');
    };

  });
