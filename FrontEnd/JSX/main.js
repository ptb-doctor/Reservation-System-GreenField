//defined the module woh will have the controller for all the HTML page
angular.module('app')
.controller('AppCtrl', function($scope){
    $scope.doctors;
    $scope.loadPage=function (){
      $.ajax({
        url:'/getDoctors',
        method:'GET',
        contentType:'applecation/json',
        async: false,
        success:function(data){
          $scope.doctors = data;
          console.log('docs', $scope.doctors);
        }
      })
    };

    $scope.reserveAppointment =function (time){

      var petientName= $("#pName").val();
      var petientPhone= $("#pPhon").val();
      var availableAppointments= $('#time').val();
      var username= $('#doctorName').text()
      $.ajax({
        url:'/reservedappointments',
        method:'PUT',
        contentType:'applecation/json',
        data:{
          patientName: petientName,
          patientPhone: petientPhone,
          availableAppointments: availableAppointments,
          username: username
        },
        success:function(){
         console.log(this.data);
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
   templateUrl: `./templates/main.html`
 })
