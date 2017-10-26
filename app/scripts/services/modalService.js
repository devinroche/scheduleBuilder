'use strict';

angular.module('scheduleBuilderApp')
  .service('modal', function (schedule) {
    for(var i=0; i<$scope.vSched.length; i++){
        if($scope.vSched[i].Class === classInfo.title){
          $scope.classInformation = $scope.vSched[i]
          $fancyModal.open({ 
            templateUrl: '../../views/classModal.html' ,
            scope: $scope
          });
          $('.fancymodal-overlay fancymodal-overlay-opening').removeClass('fancymodal-overlay fancymodal-overlay-opening')
          $( ".fancymodal-content" ).removeClass('fancymodal-content').addClass('modal-content modal-dialog')
        }
    }

    return toastrInit;
  });
