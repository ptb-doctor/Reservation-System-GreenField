angular.module('app')
.controller('loginCtrl', function($scope, $http, $location){
  $scope.errorMessage;
  $scope.submit = function () {
  
    var name = $("#username").val();
    var password = $('#password').val()
    $http.post("/login", {username: name, password: password}).then(function(data){
      if (data.data === "not in db" || data.data === "incorrect password"){
      $scope.errorMessage = data.data
    } else {window.location = "/"}
  });
}
})

.component('login',{
  templateUrl:`./views/login.html`
})