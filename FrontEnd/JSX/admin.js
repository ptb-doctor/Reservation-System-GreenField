angular.module('app')
.controller('adminCtrl', function($scope){
	$scope.date= new Date()
	$scope.username = 'Ammar';
	$scope.appointmentDate;
	$scope.appointmentTime;

	$scope.addApointment=function(){
		$scope.appointmentDate = $('#addeddateappointment').val();
		$scope.appointmentTime = $('#addedtimeappointment').val();
		// for (var doctor=0 ; doctor < $scope.appointments.length ; doctor++){
		// 	$scope.username = $scope.appointments[doctor].username;
		// }
		console.log ('+++++++++>', $scope.appointmentDate);
		$.ajax({
			url:'/addAppointments',
			method:'PUT',
			contentType:'applecation/json',
			async: false,
			data: {
				username: $scope.username,
				newAppointment: {date: $scope.appointmentDate, time: $scope.appointmentTime}
			},
			success: function(data){
				console.log('apointment added  seccessfuly', data);
			}
		})
	};

	$scope.loadAppointments=function(){
console.log('loadAppointments run');
		$.ajax({
			url:'/getAppointment',
			method:'GET',
			contentType: 'applecation/json',
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
