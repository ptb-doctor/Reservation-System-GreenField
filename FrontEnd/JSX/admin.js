angular.module('app')
.controller('adminCtrl', function($scope){
	$scope.date= new Date()
	$scope.appointments= [{date:'12/10',time:'10.05',username:'ammar'},{date:'14/10',time:'10.05'},{date:'15/10',time:'10.05'}];
	$scope.newappointment={};
	$scope.doctorname;
	
	$scope.addapointment=function(){
		var addeddateappointment= $('#addeddateappointment').val();
		var addedtimeappointment= $('#addedtimeappointment').val();
		for (var doctor=0 ; doctor < $scope.appointments.length ; doctor++){
			$scope.doctorname = $scope.appointments[doctor].username;
		}
		
		$scope.newappointment.doctorname= $scope.doctorname;
		$scope.newappointment.addeddateappointment= addeddateappointment;
		$scope.newappointment.addedtimeappointment= addedtimeappointment;

		console.log($scope.newappointment)
		$.ajax({
			url:'/addedappointments',
			method:'POST',
			contentType:'applecation/json',
			data: $scope.newappointment,
			success: function(){
				console.log('apointment added  seccessfuly');

			}
		})
	};

	$scope.loadAppointments=function(){

		$.ajax({
			url:'/getAppointment',
			method:'GET',
			contentType'applecation/json',
			success:function(data){
				console.log(data);
				$scope.appointments.push(data);
			}
		})
	}

})
.component('admin', {
  controller:"adminCtrl",
   templateUrl: `./templates/admin.html`
 })