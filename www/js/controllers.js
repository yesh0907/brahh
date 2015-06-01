var app = angular.module('starter.controllers', ['firebase'])
var fb = new Firebase("https://yeshauth.firebaseio.com/");
var user;

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
            $state.go('login')
        }
    }
    $scope.selectUsers = function() {
        $state.go('sendTo');
    }
    $scope.contactsNav = function() {
        $state.go('contacts');
    }
    $scope.profileNav = function() {
        $state.go('profile');
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
    })
  })
    .then(function(authData) {
      $location.path('/tab/chats');
  })
    .catch(function(error) {
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
            $state.go('login')
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
            $state.go('login')
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
            $state.go('login')
        }
    }

    $scope.addContact = function(contact) {
        $ionicPopup.show({
            template: '<input type="text" ng-model="data.contact" placeholder="Username">',
            title: "Username of Contact that you wish to add: ",
            scope: $scope,
            buttons: [
            { text: "Cancel" },
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.contact) {
                        e.preventDefault();
                    }
                    else {
                        if ($scope.data.hasOwnProperty("contacts") !== true) {
                            $scope.data.contacts = [];
                        }
                        $scope.data.contacts.push({
                            name: $scope.data.contact
                        })
                        $scope.data.contact = "";
                    }
                }
            },
            ]
        });
    }
    $scope.chatNav = function() {
        $state.go('tab.chats')
    }
});

app.controller('SendContactsCtrl', function($scope, $state, $firebaseObject, $ionicPopup, $location) {
    $scope.start = function() {
        fbAuth = fb.getAuth();
        if (fbAuth) {
            var syncObject = $firebaseObject(fb.child("users"));
            //console.log(syncObject);
            syncObject.$bindTo($scope, "user");
            var sync = $firebaseObject(fb.child("users/" + fbAuth.uid));
            console.log(sync);
            sync.$bindTo($scope, "data");
        }
        else {
            $ionicPopup.alert({
                title: "Sorry",
                template: "Please login..."
            });
            $state.go('login')
        }
    }

    $scope.sendChat = function(user) {
        console.log($scope.user["simplelogin:5"]);
        user = $scope.user["simplelogin:5"].userData[0].name;
        var selected = document.getElementsByClassName("user-true");

        // for (var i = 0; i < selected.length; i++) {
        //     console.log(selected[i].innerText);
        // }

        var timeStamp = moment().format('llll');

        if ($scope.data.hasOwnProperty("chats") !== true) {
            $scope.data.chats = [];
        }
        $scope.data.chats.push({
            message: user + " Brahhed you",
            time: timeStamp
        });

        $state.go('tab.chats');
    }

    $scope.chatNav = function() {
        $location.path('/tab/chats');
    }
});