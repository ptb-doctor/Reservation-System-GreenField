//defined the module woh will have the controller for all the HTML page
angular.module('app')
.controller('AppCtrl', function($scope){
    $scope.doctors =[{
    name:'aya', image:'./Images/malelogo.png',specialization:'heart',phonnumber:079877546 ,availableAppointments:[{date:'12/10',time:'10.05'},{date:'14/10',time:'10.05'},{date:'15/10',time:'10.05'}],showAppointments:false, showAll:true
},{
    name:'ammar', image:'./Images/malelogo.png',specialization:'heart',phonnumber:079 ,availableAppointments:[{date:'12/10',time:'10.05'},{date:'14/10',time:'10.05'},{date:'15/10',time:'10.05'}],showAppointments:false, showAll:true}];
    $scope.loadPage=function (){
      $.ajax({
        url:'/',
        method:'GET',
        contentType:'applecation/json',
        success:function(data){
          $scope.doctors.push(data)
        }
      })
    };

    $scope.reserveAppointment =function (time){
      this.appointment={};
      this.appointment.petientName= $("#pName").val();
      this.appointment.petientPhone= $("#pPhon").val();
      this.appointment.availableAppointments= $('#time').val();
      this.appointment.doctorName= $('#doctorName').text()
      $.ajax({
        url:'/reservedappointments',
        method:'POST',
        contentType:'applecation/json',
        data:this.appointment,
        success:function(){
         console.log('appointment reserved'); 
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
