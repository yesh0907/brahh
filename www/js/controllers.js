var app = angular.module('starter.controllers', ['firebase'])
var fb = new Firebase("https://brahh-yesh.firebaseio.com/");
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

app.controller('LoginCtrl', function($scope, $firebaseAuth, $location, $ionicPopup, $state, $rootScope){
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
      $state.go('settings');
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
            //console.log(syncObject);

            var object = $firebaseObject(fb.child("users"));
            object.$bindTo($scope, "users");
            //console.log(object);
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
                        $scope.userNames = [];
                        var contacts = [];
                        for (var i = 1; i < 7; i++) {
                            //console.log($scope.users["simplelogin:"+i]);
                            $scope.userNames.push($scope.users["simplelogin:"+i].userData[0].name);
                            //contacts.push($scope.data.contacts[i-1].name);
                            //console.log($scope.data.contacts[i-1].name);
                        }

                        var match = false;
                        var counter = 0;
                        //console.log($scope.userNames);
                        for (var j = 0; j <= $scope.userNames.length; j++) {
                            //Contact Already Exsists...
                            //console.log(contacts[j-1]);
                            if ($scope.data.contact === contacts[j-1]) {
                                $ionicPopup.alert({
                                    title: "Contact Already Exsits"
                                });
                            }
                            //Found A Match and Saved
                            else if ($scope.data.contact === $scope.userNames[j] && !match) {
                                match = true;
                                if ($scope.data.hasOwnProperty("contacts") !== true) {
                                    $scope.data.contacts = [];
                                }
                                $scope.data.contacts.push({
                                    name: $scope.data.contact
                                })
                                $scope.data.contact = "";
                            }
                            //Could Not Find a Match
                            else if (counter >= $scope.userNames.length) {
                                $ionicPopup.alert({
                                    title: "No Match Found"
                                });
                                $scope.data.contact = "";
                            }
                            //Didn't find a match but still looking
                            else if ($scope.data.contact !== $scope.userNames[j] && !match) {
                                counter++;
                                //console.log("Counter: " + counter);
                            }
                            else if (match) {
                                console.log("Matched");
                                $scope.data.contact = "";
                                break;
                            }
                            // console.log(j);
                            // console.log($scope.userNames.length);
                        }
                    }
                }
            }
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
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
            //console.log(syncObject);

            var object = $firebaseObject(fb.child("users"));
            object.$bindTo($scope, "users");
            //console.log(object);
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
        user = $scope.data.userData[0].name;
        var sendTo = [];
        var selected = document.getElementsByClassName("user-true");
        var timeStamp = moment().format('llll');
        for (var i = 0; i < selected.length; i++) {
            sendTo.push(selected[i].innerText);
        }

        for (var j = 1; j <= sendTo.length; j++) {
            console.log("Contacts to Send Brahh to: " + sendTo[j-1]);
            console.log("Name of user: " + $scope.users["simplelogin:"+(j)].userData[0].name);
            if (sendTo[j-1] === $scope.users["simplelogin:"+j].userData[0].name) {
                if ($scope.users["simplelogin:"+j].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+j].chats = [];
                }
                $scope.users["simplelogin:"+j].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+1)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+1)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+1)].chats = [];
                }
                $scope.users["simplelogin:"+(j+1)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+2)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+2)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+2)].chats = [];
                }
                $scope.users["simplelogin:"+(j+2)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+3)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+3)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+3)].chats = [];
                }
                $scope.users["simplelogin:"+(j+3)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+4)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+4)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+4)].chats = [];
                }
                $scope.users["simplelogin:"+(j+4)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+5)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+5)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+5)].chats = [];
                }
                $scope.users["simplelogin:"+(j+5)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+6)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+6)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+6)].chats = [];
                }
                $scope.users["simplelogin:"+(j+6)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
            else if (sendTo[j-1] === $scope.users["simplelogin:"+(j+7)].userData[0].name) {
                if ($scope.users["simplelogin:"+(j+7)].hasOwnProperty("chats") !== true) {
                    $scope.users["simplelogin:"+(j+7)].chats = [];
                }
                $scope.users["simplelogin:"+(j+7)].chats.push({
                    message: user + " Brahhed you",
                    time: timeStamp
                });
                $ionicPopup.alert({
                    title: "Brahh Sent",
                });
            }
        }

        $state.go('tab.chats');
    }

    $scope.chatNav = function() {
        $location.path('/tab/chats');
    }
});