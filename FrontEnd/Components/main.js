//defined the module woh will have the controller for all the HTML page
angular.module('app')
.controller('AppCtrl', function($scope){
    $scope.doctors;
    $scope.currentDoctor;
    $scope.timeA;

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

    // Get doctor data
    $scope.getDoctorData = function(name) {
      console.log('55555555555555555', name);
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

    $scope.reserveAppointment =function (time){

      var petientName= $("#pName").val();
      var petientPhone= $("#pPhon").val();
      $.ajax({
        url:'/reservedappointments',
        method:'PUT',
        dataType:'json',
        data:{
          patientName: petientName,
          patientPhone: petientPhone,
          availableAppointments: $scope.timeA
        },
        success:function(){
         console.log('------------> yaaaaaaaaaaaaaaaaay');
        }
      })
    };
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
 })
 .component('main', {
  controller:"AppCtrl",
   templateUrl: `./views/main.html`
 })
