var app = angular.module('starter.controllers', ['firebase'])
var fb = new Firebase("https://yeshauth.firebaseio.com/");

app.controller('ChatsCtrl', function($scope, $firebaseObject, $ionicPopup, $state) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        else {
            $ionicPopup.alert({
                title: "Sorry",
                template: "Please login in to send chats..."
            });
            $state.go('/login')
        }
    }
    $scope.sendChat = function(chat) {
        var user = $scope.data.userData[0].name;

        var timeStamp = moment().format('llll');

        if ($scope.data.hasOwnProperty("chats") !== true) {
            $scope.data.chats = [];
        }
        $scope.data.chats.push({
            message: user + " Brahhed you",
            time: timeStamp
        });
    }
    $scope.contactsNav = function() {
        $state.go('contacts');
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

app.controller('ProfileCtrl', function($scope, $location, $firebaseObject, $ionicPopup) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        else {
            $ionicPopup.alert({
                title: "Sorry",
                template: "Please login..."
            });
            $state.go('/login')
        }
    }

    $scope.settingsNav = function() {
        $location.path('/settings');
    }

    $scope.chatNav = function() {
        $location.path('/tab/chats');
    }
});

app.controller('SettingsCtrl', function($scope, $state, $firebaseObject, $ionicPopup) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        else {
            $ionicPopup.alert({
                title: "Sorry",
                template: "Please login..."
            });
            $state.go('/login')
        }
    }

    $scope.save = function(nameValue, ageValue) {
        $scope.data.userData = [];
        $scope.data.userData.push({
            name: nameValue,
            age: ageValue
        });
        $state.go('profile');
    }
});

app.controller('ContactsCtrl', function($scope, $state, $firebaseObject, $ionicPopup) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        else {
            $ionicPopup.alert({
                title: "Sorry",
                template: "Please login..."
            });
            $state.go('/login')
        }
    }

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }

  $scope.addContact = function(contact) {
    $ionicPopup.prompt({
        title: "Username of Contact that you wish to add: "
    })
    .then(function(result) {
        if (result !== "") {
            if ($scope.data.hasOwnProperty("contacts") !== true) {
                $scope.data.contacts = [];
            }
            $scope.data.contacts.push({
                name: result
            });
        }
        else {
            console.log("Cancelled");
        }
    })
}

$scope.chatNav = function() {
    $state.go('tab.chats')
}
});