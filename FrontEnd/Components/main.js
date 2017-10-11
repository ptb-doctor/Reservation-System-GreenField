//defined the module woh will have the controller for all the HTML page
angular.module('app')
.controller('AppCtrl', function($scope){
    $scope.doctors;
    $scope.currentDoctor;
    $scope.timeA;
    $scope.isLoggedIn = false;
    $scope.doctor = false;
  
    $scope.checkIsLoggedIn = function() {
      console.log(';lk;lk;lk');
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
          if(data=='doctor'){
            $scope.doctor=true
            $scope.isLoggedIn = true;}
  
          if(data=='patient'){
            $scope.doctor=false
            $scope.isLoggedIn = true;}
        }
      })
    }
// load the doctors informations from the database 
    $scope.loadPage=function (){
      $.ajax({
        url:'/getDoctors',
        method:'GET',
        async: false,
        success:function(data){
          $scope.doctors = data;
          console.log('docs', $scope.doctors);
        }
      })
    };

    // Get doctor data and the rest doctors 
    $scope.getDoctorData = function(name) {
      console.log('555555555555555557', $scope.timeA);
      $.ajax({
        url:'/getDoctorData',
        method:'POST',
        async: false,
        dataType: 'json',
        data: {
          doctorName: name
        },
        success: function (data){
          $scope.currentDoctor = data;
          console.log('--------------->', $scope.currentDoctor);
        }
      });
      console.log('ssssssssssssssssssssssss');
    }
//it's for submit the paitent information and reserved appointment  
    $scope.reserveAppointment =function (time){
      console.log('1111111111111111', $scope.timeA)
      var Case= $("#pcase").val();
     // var petientPhone= $("#pPhon").val();
     console.log('doctor------',$scope.currentDoctor[0])
     console.log('time------',$scope.timeA)
     console.log('case------',Case)
      $.ajax({
        url:'/reservedappointments',
        method:'PUT',
        dataType:'json',
        data:{
          doctor: $scope.currentDoctor[0],
          time:$scope.timeA,
          Case:Case
        },
        success:function(){
         console.log('------------> yaaaaaaaaaaaaaaaaay');
        }
      })
    };
    // when you click on a doctor this function will show the specific doctor  
    $scope.showDoctorAppointments = function (name){
      var currentDoctors = $scope.doctors;
      for (var i = 0; i < currentDoctors.length; i++) {
        if (currentDoctors[i].name === name)
        {
          currentDoctors[i].showAppointments = !currentDoctors[i].showAppointments;
        }else{
          currentDoctors[i].showAll = !currentDoctors[i].showAll;
        }
      }
    }
    $scope.init = function(){
      $scope.loadPage()
      $scope.checkIsLoggedIn()
    }
 })
 .component('main', {
  controller:"AppCtrl",
   templateUrl: `./views/main.html`
 })
