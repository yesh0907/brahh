var app = angular.module('starter.controllers', ['firebase'])
var fb = new Firebase("https://yeshauth.firebaseio.com/");

app.controller('ChatsCtrl', function($scope, $firebaseObject, $rootScope, $ionicPopup) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        else {
            console.log("ERROR...");
        }
    }
    $scope.sendChat = function(chat) {
        var timeStamp = function() {
            // Create a date object with the current time
            var now = new Date();

            // Create an array with the current month, day and time
            var date = [now.getMonth() + 1, now.getDate(),
            now.getFullYear()
            ];

            // Create an array with the current hour, minute and second
            var time = [now.getHours(), now.getMinutes()];

            // Determine AM or PM suffix based on the hour
            var suffix = (time[0] < 12) ? "AM" : "PM";

            // Convert hour from military time
            time[0] = (time[0] < 12) ? time[0] : time[0] -
            12;

            // If hour is 0, set it to 12
            time[0] = time[0] || 12;

            // If seconds and minutes are less than 10, add a zero
            for (var i = 1; i < 3; i++) {
                if (time[i] < 10) {
                    time[i] = "0" + time[i];
                }
            }

            // Return the formatted string
            return date.join("/") + " " + time.join(":") +
            " " + suffix;
        }

        if ($scope.data.hasOwnProperty("chats") !== true) {
            $scope.data.chats = [];
        }
        $scope.data.chats.push({
            user: 'guest',
            message: chat.message,
            time: timeStamp()
        });
        chat.message = "";
    }
});

app.controller('LoginCtrl', function($scope, $firebaseAuth, $location, $ionicPopup, $rootScope){
  $scope.login = function(username, password) {
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$authWithPassword({
      email: username,
      password: password
  }).then(function(authData) {
      $location.path('/tab/chats');
      $rootScope.username = fbAuth.email;

  }).catch(function(error) {
      $ionicPopup.alert({
        title: "Error",
        template: error
    });
  });
}

$scope.register = function(username, password) {
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$createUser({email: username, password: password}).then(function() {
      return fbAuth.$authWithPassword({
        email: username,
        password: password
    });
  }).then(function(authData) {
      $location.path('/tab/chats');
  }).catch(function(error) {
      $ionicPopup.alert({
        title: "Error",
        template: error
    });
  });
}
});