'use strict';

/**
 * @ngdoc service
 * @name scheduleBuilderApp.toastr
 * @description
 * # toastr
 * Service in the scheduleBuilderApp for making toastrs pop up and do cool stuff!
 */
angular.module('scheduleBuilderApp')
  .service('toastr', function () {
    var toastrInit = function (type, msg){
      console.log('poop')
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };
      toastr[type](msg);
    }
    return toastrInit
  });
