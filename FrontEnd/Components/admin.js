angular.module('app')
//we defined this varibals to be global for the others functions 
    .controller('adminCtrl', function($scope, $http) {
        $scope.appointmentDate;
        $scope.appointmentTime;
				$scope.appointments;
				$scope.counter = 0;
// it's for add new avalibal appointment 
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
// it will print the reserved appointments from the database
        $scope.loadAppointments = function(name) {
            console.log('loadAppointments run');
            $.ajax({
                url: '/getDoctorReservedAppointments',
                method: 'GET',
                dataType: 'json',
								async: false,
                success: function(data) {
									console.log('++++++++++++++', data);
                    $scope.appointments = data.reservedAppointments;
                }
            })
        }
    })
    

    //     $scope.deleteAppointment = (appointment) => {
    //         console.log('asdasdasdasd;as;kdmas;kdmja;sj', appointment)
    //         $.ajax({
    //             url: '/deleteAppointment',
    //             method: 'DELETE',
    //             dataType: 'json',
    //             data: {
    //                 reservedAppointment: appointment
    //             },
    //             success: () => {
    //                 console.log('hahahahahah')
    //             }
    //         })
    //     }
    // })
    .component('admin', {
        controller: "adminCtrl",
        templateUrl: `./views/admin.html`
    })
