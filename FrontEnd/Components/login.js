angular.module('app')
.controller('loginCtrl', function($scope){
  $scope.errorMessage;
  $scope.submit = function () {
  
    var name = $("#username").val();
    var password = $('#password').val()
    $.ajax({
      url: '/login',
      method: 'post',
      dataType: 'json',
      data: {
          username: name,
          password: password
      },
      success: (data) => {
          console.log(data)
      },
      error: (err) => {
       $scope.errorMessage = err.responseText
      }
  })
}
})

.component('login',{
  templateUrl:`./views/login.html`
})
