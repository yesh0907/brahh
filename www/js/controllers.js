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
                        return $scope.data.contact;
                    }
                }
            },
            ]
        }).then(function(result) {
            if (result !== "") {
                if ($scope.data.hasOwnProperty("contacts") !== true) {
                    $scope.data.contacts = [];
                }
                $scope.data.contacts.push({
                    name: result
                });
            }
        });

        // $ionicPopup.prompt({
        //     title: "Username of Contact that you wish to add: ",
        //     inputType: "text"
        // })
        // .then(function(result) {
        //     if (result !== "") {
        //         if ($scope.data.hasOwnProperty("contacts") !== true) {
        //             $scope.data.contacts = [];
        //         }
        //         $scope.data.contacts.push({
        //             name: result
        //         });
        //     }
        //     else if (result === undefined) {
        //         console.log("Cancelled");
        //     }
        // })
        // .catch(function(error) {
        //     console.log(error);
        // });
}

$scope.chatNav = function() {
    $state.go('tab.chats')
}
});

app.controller('SendContactsCtrl', function($scope, $state, $firebaseObject, $ionicPopup, $location) {
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

    $scope.sendChat = function(user) {
        var user = $scope.data.userData[0].name;

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