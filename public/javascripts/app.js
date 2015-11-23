// (function() {
'use strict';

var app = angular
  .module('app', [
    'ngResource'
  ]);

app.factory('socket2', function ($rootScope) {
  var socket = io.connect('http://localhost:3001');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('mainController',['$scope','socket2', function($scope,socket2) {

    $scope.title="Controller title";
    $scope.message ="default content of the message";
    $scope.response ="empty..";
    
    socket2.on('status', function (data) {
      $scope.response = data;
       console.log(data);
    });

    	$scope.picturePostProcessing = function()
      {
        socket2.emit("status", $scope.message)
        //socket.emit('status', 'go!');
        //console.log("test");
    };
  }]);
// });
