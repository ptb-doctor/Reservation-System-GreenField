angular.module('app')
    .controller('adminCtrl', function($scope) {
        $scope.appointmentDate;
        $scope.appointmentTime;
				$scope.appointments;
				$scope.counter = 0;

        $scope.addApointment = function() {
            $scope.appointmentDate = $('#addeddateappointment').val();
            $scope.appointmentTime = $('#addedtimeappointment').val();
            // for (var doctor=0 ; doctor < $scope.appointments.length ; doctor++){
            // 	$scope.username = $scope.appointments[doctor].username;
            // }
            console.log('+++++++++>', $scope.appointmentDate);
            $.ajax({
                url: '/addAppointments',
                method: 'PUT',
                dataType: 'json',
                async: false,
                data: {
                    newAppointment: {
                        date: $scope.appointmentDate,
                        time: $scope.appointmentTime
                    }
                },
                success: function(data) {
                    console.log('apointment added  seccessfuly', data);
                }
            })
        };

        $scope.loadAppointments = function(name) {
            console.log('loadAppointments run');
            $.ajax({
                url: '/getDoctorReservedAppointments',
                method: 'GET',
                dataType: 'json',
								async: false,
                success: function(data) {
									console.log('++++++++++++++');
                    $scope.appointments = data.reservedAppointments;
                }
            })
        }
    })
    .component('admin', {
        controller: "adminCtrl",
        templateUrl: `./views/admin.html`
    })
