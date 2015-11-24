// (function() {
'use strict';

var app = angular
  .module('app', ['ngResource']);

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

// Directive
// ---------
app.directive('fileChange', function () {

    var linker = function ($scope, element, attributes) {
        // onChange, push the files to $scope.files.
        element.bind('change', function (event) {
            var files = event.target.files;
            $scope.$apply(function () {
                for (var i = 0, length = files.length; i < length; i++) {
                    $scope.files.push(files[i]);
                }
            });
        });
    };

    return {
        restrict: 'A',
        link: linker
    };

});

// Factory
// -------
app.factory('uploadService', ['$rootScope', function ($rootScope) {

    return {
        send: function (file) {
            var data = new FormData(),
                xhr = new XMLHttpRequest();

            // When the request starts.
            xhr.onloadstart = function () {
                console.log('Factory: upload started: ', file.name);
                $rootScope.$emit('upload:loadstart', xhr);
            };

            // When the request has failed.
            xhr.onerror = function (e) {
                $rootScope.$emit('upload:error', e);
            };

            // Send to server, where we can then access it with $_FILES['file].
            data.append('file', file, file.name);
            xhr.open('POST', '/upload');
            xhr.send(data);
        }
    };
}]);


app.controller('mainController',['$scope','$rootScope','uploadService','socket2', function($scope,$rootScope,uploadService,socket2)
{
  $scope.files = [];

  $scope.$watch('files', function (newValue, oldValue) {
         // Only act when our property has changed.
         if (newValue != oldValue) {
             console.log('Controller: $scope.files changed. Start upload.');
             for (var i = 0, length = $scope.files.length; i < length; i++) {
                 // Hand file off to uploadService.
                 uploadService.send($scope.files[i]);
             }
         }
     }, true);

     $rootScope.$on('upload:loadstart', function () {
         console.log('Controller: on `loadstart`');
     });

     $rootScope.$on('upload:error', function () {
         console.log('Controller: on `error`');
     });

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
