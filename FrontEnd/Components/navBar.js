angular.module('app')
.controller('navBar', ($scope, $http) => {
  $scope.isLoggedIn = false;
  $scope.showPro = false;
  $scope.doctor;

  $scope.checkIsLoggedIn = function() {
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    // $http({
    //   url:'/checkIsLoggedIn',
    //   method: 'GET',
    // }).then(function successCallback(res){
    //   $scope.isLoggedIn = res;
    //   console.log(res, $scope.isLoggedIn);
    // })
    $.ajax({
      url: '/checkIsLoggedIn',
      method: 'GET',
      async: false,
      success: function (data){
        if(data=='doctor')
            $scope.doctor=true;
          $scope.isLoggedIn = true;
        if(data=='patient')
            $scope.doctor=false;
          $scope.isLoggedIn = true;
      }
    })
  }

  $scope.profile = function (){
    $scope.showPro = true;
}
})
.component('navbar',{
  templateUrl: './views/navBar.html'
})
