'use strict';

angular
  .module('app', [
    'ngResource'
  ])
  .controller('mainController',['$scope',function($scope){
    $scope.title="Controller title"

    	$scope.picturePostProcessing = function()
      {
        console.log("test");
    };
  }]);
